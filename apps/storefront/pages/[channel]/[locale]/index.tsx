import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import React, { ReactElement } from "react";

import { HomepageBlock, Layout } from "@/components";
import { BaseSeo } from "@/components/seo/BaseSeo";
import { HOMEPAGE_MENU } from "@/lib/const";
import { contextToRegionQuery } from "@/lib/regions";
import { useHomepageBlocksQuery } from "@/saleor/api";
import BannerPage from "@/components/BannerPage";
import { ProductTypes } from "@/components/ProductTypes";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      context: contextToRegionQuery(context),
    },
    revalidate: 60 * 60, // value in seconds, how often ISR will trigger on the server
  };
};
function Home({ context }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data } = useHomepageBlocksQuery({
    variables: { slug: HOMEPAGE_MENU, ...context },
  });
  const menuData = data;
  console.log("menuData::: ", menuData);
  return (
    <>
      <BaseSeo />
      <div className="pb-10">
        <header>
          <div className="container" />
        </header>
        <main>
          <BannerPage />
          <div className="lg:px-[100px] md:px-[16px]">
            <ProductTypes />
            {menuData?.menu?.items?.map((m, index) => {
              if (!m || index > 0) return null;
              return <HomepageBlock key={m.id} menuItem={m} />;
            })}
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
