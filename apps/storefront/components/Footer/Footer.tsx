import clsx from "clsx";
import Link from "next/link";
import { HTMLAttributes } from "react";

import { getLinkPath } from "@/lib/menus";
import { usePaths } from "@/lib/paths";
import { useFooterMenuQuery } from "@/saleor/api";

import { Box } from "../Box";
import { useRegions } from "../RegionsProvider";
import styles from "./Footer.module.css";

export type FooterProps = HTMLAttributes<HTMLElement>;

// Saleor Cloud currently doesn't support relative URLs in the footer.
// This is a workaround to make the links work.
// @todo remove this when the issue is fixed.
const fixMenuItemLocalhostUrl = (url: string) => url.replace(/^https?:\/\/localhost:8000\//, "/");

export function Footer({ className, ...rest }: FooterProps) {
  const paths = usePaths();
  const { query, currentChannel, currentLocale } = useRegions();

  const { data, error } = useFooterMenuQuery({ variables: { ...query } });

  if (error) {
    console.error("Footer component error", error.message);
  }

  const menu = data?.menu?.items || [];
  // console.log("menu:: ", menu);
  return (
    <>
      <footer className={clsx(styles.footer, className)} {...rest}>
        <Box className={styles["footer-inner"]}>
          <div className="flex mb-14 sm:mb-0">
            <div className="grid grid-cols-4">
              {menu.map((item) => (
                <div className="sm:ml-14" key={item?.id}>
                  {item?.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles["menu-heading"]}
                    >
                      {item?.name}
                    </a>
                  ) : (
                    <Link
                      href={getLinkPath(item, currentChannel.slug, currentLocale)}
                      passHref
                      legacyBehavior
                    >
                      <a href="pass" className={styles["menu-heading"]}>
                        {item?.name}
                      </a>
                    </Link>
                  )}
                  <ul className={styles.menu}>
                    {item?.children?.map((sub) => (
                      <li key={sub?.id}>
                        {sub?.url ? (
                          <a
                            href={fixMenuItemLocalhostUrl(sub.url)}
                            target="_blank"
                            rel="noreferrer"
                            className={styles["menu-link"]}
                            data-testid={`footerExternalLinks${sub?.name}`}
                          >
                            {sub?.name}
                          </a>
                        ) : (
                          <Link
                            href={getLinkPath(sub, currentChannel.slug, currentLocale)}
                            passHref
                            legacyBehavior
                          >
                            <a
                              href="pass"
                              className={styles["menu-link"]}
                              data-testid={`footerInternalLinks${sub?.name}`}
                            >
                              {sub?.name}
                            </a>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Box>
        <div className="border-t-[0.5px] border-[#282828] py-4 lg:px-[100px] md:px-[16px]">
          <p className="text-[#ADADAD] text-sm">Copyright 2023 - Tan Brothers Auto Co., Ltd.</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
