import { useShopQuery } from "@/saleor/api";
import { Footer } from "../Footer";
import { Header } from "../Header";
import styles from "./Layout.module.css";
export interface LayoutProps {
  children?: React.ReactNode;
  bodyOnly?: boolean;
}

export function Layout({ children, bodyOnly }: LayoutProps) {
  const { data: shopData } = useShopQuery();

  if (bodyOnly) return <div className="align-middle flex flex-col flex-grow">{children}</div>;
  const shop = shopData?.shop;
  return (
    <>
      <div className="lg:px-[100px] md:px-[16px]">
        <Header shop={shop} />
      </div>
      <div className={`${styles.main} align-middle flex flex-col flex-grow`}>{children}</div>
      <Footer shop={shop} />
    </>
  );
}

export default Layout;
