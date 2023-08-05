import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Custom404 from "pages/404";
import React, { ReactElement } from "react";

import { Layout, PageHero } from "@/components";
import { FilteredProductList } from "@/components/productList/FilteredProductList";
import { mapEdgesToItems } from "@/lib/maps";
import { contextToRegionQuery } from "@/lib/regions";
import {
  AttributeFilterFragment,
  FilteringAttributesQuery,
  FilteringAttributesQueryDocument,
  FilteringAttributesQueryVariables,
  ProductTypeBySlugQuery,
  ProductTypeBySlugQueryVariables,
  ProductTypeBySlugDocument,
} from "@/saleor/api";
import { serverApolloClient } from "@/lib/ssr/common";
import usePaths from "@/lib/paths";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ channel: string; locale: string; slug: string }>
) => {
  if (!context.params) {
    return {
      props: {},
      notFound: true,
    };
  }

  const productTypeSlug = context.params.slug.toString();
  const response: ApolloQueryResult<ProductTypeBySlugQuery> = await serverApolloClient().query<
    ProductTypeBySlugQuery,
    ProductTypeBySlugQueryVariables
  >({
    query: ProductTypeBySlugDocument,
    variables: {
      id: productTypeSlug,
      ...contextToRegionQuery(context),
    },
  });

  const attributesResponse: ApolloQueryResult<FilteringAttributesQuery> =
    await serverApolloClient().query<FilteringAttributesQuery, FilteringAttributesQueryVariables>({
      query: FilteringAttributesQueryDocument,
      variables: {
        ...contextToRegionQuery(context),
        filter: {
          inProductType: response.data.productType?.id,
        },
      },
    });

  let attributes: AttributeFilterFragment[] = mapEdgesToItems(attributesResponse.data.attributes);
  attributes = attributes.filter((attribute) => attribute.choices?.edges.length);

  return {
    props: {
      productType: response.data.productType,
      attributeFiltersData: attributes,
    },
  };
};
function CollectionPage({
  productType,
  attributeFiltersData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!productType) {
    return <Custom404 />;
  }

  return (
    <>
      <header className="lg:px-[100px] md:px-[16px] mb-4 pt-4 border-t">
        <PageHero
          title={productType?.name || ""}
          description={""}
          breadcrumbs={[{ label: "Home", link: "/" }, { label: productType?.name || "" }]}
        />
      </header>
      <div className="lg:px-[100px] md:px-[16px] px-8 mb-16">
        <FilteredProductList
          attributeFiltersData={attributeFiltersData}
          productTypeIDs={[productType.id]}
        />
      </div>
    </>
  );
}

export default CollectionPage;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

CollectionPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
