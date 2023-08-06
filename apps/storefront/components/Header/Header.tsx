import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import styles from "./Header.module.css";
import Image from "next/legacy/image";
import NavIconButton from "../Navbar/NavIconButton";
import UserMenu from "../Navbar/UserMenu";
import usePaths from "@/lib/paths";
import { CheckoutLineDetailsFragment, ShopFragment } from "@/saleor/api";
import { useRouter } from "next/router";
import { useUser } from "@/lib/useUser";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { useRegions } from "@/components/RegionsProvider";
import { invariant } from "@apollo/client/utilities/globals";
import { BurgerMenu } from "../BurgerMenu";
import { PhoneIcon } from "@heroicons/react/outline";
import Navbar from "../Navbar";

interface HeaderProps {
  shop?: ShopFragment;
}
export function Header({ shop }: HeaderProps) {
  const paths = usePaths();
  const router = useRouter();

  const [isBurgerOpen, setBurgerOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const { authenticated: actuallyAuthenticated } = useUser();
  const { checkout } = useCheckout();
  const { currentLocale, currentChannel } = useRegions();

  // Avoid hydration warning by setting authenticated state in useEffect
  useEffect(() => {
    setAuthenticated(actuallyAuthenticated);
  }, [actuallyAuthenticated]);

  const saleorApiUrl = process.env.API_URI;
  invariant(saleorApiUrl, "Missing API_URI");
  const domain = new URL(saleorApiUrl).hostname;

  const checkoutParams = checkout
    ? new URLSearchParams({
        checkout: checkout.id,
        locale: currentLocale,
        channel: currentChannel.slug,
        saleorApiUrl,
        // @todo remove `domain`
        // https://github.com/saleor/saleor-dashboard/issues/2387
        // https://github.com/saleor/saleor-app-sdk/issues/87
        domain,
      })
    : new URLSearchParams();

  const externalCheckoutUrl = checkout ? `/checkout/?${checkoutParams.toString()}` : "#";

  useEffect(() => {
    // Close side menu after changing the page
    router.events.on("routeChangeStart", () => {
      if (isBurgerOpen) {
        setBurgerOpen(false);
      }
    });
  });

  const counter =
    checkout?.lines?.reduce(
      (amount: number, line?: CheckoutLineDetailsFragment | null) =>
        line ? amount + line.quantity : amount,
      0
    ) || 0;
  const logoUrl = shop?.metadata?.find((meta) => meta.key === "logo")?.value;
  const phone = shop?.companyAddress?.phone;

  return (
    <>
      <div className={clsx(styles.header)}>
        <div className={clsx(styles.inner)}>
          <div className="flex items-center flex-1 flex-row">
            <Link href="/" passHref legacyBehavior>
              <a href="pass" className="hidden sm:inline-block">
                <div className="mt-px group block h-[64px] w-[120px] relative">
                  {logoUrl && <Image src={logoUrl} alt="Le Story logo" layout="fill" />}
                </div>
              </a>
            </Link>
            <div className="flex flex-1 justify-center">
              <Navbar />
            </div>
            <div className="flex justify-end">
              {!authenticated ? (
                <Link href={paths.account.login.$url()} passHref legacyBehavior>
                  <a href="pass" data-testid="userIcon">
                    <NavIconButton isButton={false} icon="user" aria-hidden="true" />
                  </a>
                </Link>
              ) : (
                <UserMenu />
              )}
              <a href={externalCheckoutUrl} className="ml-2 hidden xs:flex" data-testid="cartIcon">
                <NavIconButton isButton={false} icon="bag" aria-hidden="true" counter={counter} />
              </a>
              <div className="ml-2 hidden xs:flex items-center justify-center pl-14">
                {phone && (
                  <>
                    <PhoneIcon width={24} />
                    <div className="flex flex-col flex-1 pl-2">
                      <p className="text-sm leading-none font-thin">Hot Line Number</p>
                      <a href="tel:023881629" className="text-sm font-medium">
                        {phone}
                      </a>
                    </div>
                  </>
                )}
              </div>
              <NavIconButton
                icon="menu"
                className="ml-2 lg:hidden"
                onClick={() => setBurgerOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
      <BurgerMenu open={isBurgerOpen} onCloseClick={() => setBurgerOpen(false)} />
    </>
  );
}
export default Header;
