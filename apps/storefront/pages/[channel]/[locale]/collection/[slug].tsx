import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Custom404 from "pages/404";
import React, { ReactElement } from "react";

import { Layout, PageHero } from "@/components";
import { FilteredProductList } from "@/components/productList/FilteredProductList";
import { CollectionPageSeo } from "@/components/seo/CollectionPageSeo";
import { mapEdgesToItems } from "@/lib/maps";
import { contextToRegionQuery } from "@/lib/regions";
import { translate } from "@/lib/translations";
import {
  AttributeFilterFragment,
  CollectionBySlugDocument,
  CollectionBySlugQuery,
  CollectionBySlugQueryVariables,
  FilteringAttributesQuery,
  FilteringAttributesQueryDocument,
  FilteringAttributesQueryVariables,
} from "@/saleor/api";
import { serverApolloClient } from "@/lib/ssr/common";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ channel: string; locale: string; slug: string }>
) => {
  if (!context.params) {
    return {
      props: {},
      notFound: true,
    };
  }

  const collectionSlug = context.params.slug.toString();
  const response: ApolloQueryResult<CollectionBySlugQuery> = await serverApolloClient().query<
    CollectionBySlugQuery,
    CollectionBySlugQueryVariables
  >({
    query: CollectionBySlugDocument,
    variables: {
      slug: collectionSlug,
      ...contextToRegionQuery(context),
    },
  });

  const attributesResponse: ApolloQueryResult<FilteringAttributesQuery> =
    await serverApolloClient().query<FilteringAttributesQuery, FilteringAttributesQueryVariables>({
      query: FilteringAttributesQueryDocument,
      variables: {
        ...contextToRegionQuery(context),
        filter: {
          inCollection: response.data.collection?.id,
        },
      },
    });

  let attributes: AttributeFilterFragment[] = mapEdgesToItems(attributesResponse.data.attributes);
  attributes = attributes.filter((attribute) => attribute.choices?.edges.length);

  return {
    props: {
      collection: response.data.collection,
      attributeFiltersData: attributes,
    },
  };
};
function CollectionPage({
  collection,
  attributeFiltersData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!collection) {
    return <Custom404 />;
  }

  return (
    <>
      <CollectionPageSeo collection={collection} />
      <header className="lg:px-[100px] md:px-[16px] mb-4 pt-4 border-t">
        <PageHero
          title={translate(collection, "name")}
          description={translate(collection, "description") || ""}
        />
      </header>
      <div className="lg:px-[100px] md:px-[16px] px-8 mt-4 mb-16">
        <FilteredProductList
          attributeFiltersData={attributeFiltersData}
          collectionIDs={[collection.id]}
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
