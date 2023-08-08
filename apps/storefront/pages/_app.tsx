import "styles/sks-fonts.css";
import "styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { NextPage } from "next";
import App, { AppContext, AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import React, { ReactElement, ReactNode, useEffect } from "react";

import { RegionsProvider } from "@/components/RegionsProvider";
import { BaseSeo } from "@/components/seo/BaseSeo";
import typePolicies from "@/lib/auth/typePolicies";
import { CheckoutProvider } from "@/lib/providers/CheckoutProvider";
import { SaleorAuthProvider, useAuthChange, useSaleorAuthClient } from "@saleor/auth-sdk/react";
import { useAuthenticatedApolloClient } from "@/lib/hooks/useAuthenticatedApolloClient";
import { getQueryParams } from "@/lib/url";
import { getSubdomain } from "@/lib/subdomain";
import { isArray } from "@apollo/client/utilities";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement, router?: AppProps["router"]) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  API_URI: string;
};

function MyApp({ Component, pageProps, router, API_URI }: AppPropsWithLayout) {
  // @todo remove this hack when we have a better solution for API_URI
  process.env.API_URI = API_URI;

  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  const useSaleorAuthClientProps = useSaleorAuthClient({
    saleorApiUrl: API_URI,
  });
  const { refreshToken } = getQueryParams(router);
  const { saleorAuthClient } = useSaleorAuthClientProps;

  const { apolloClient, reset, refetch } = useAuthenticatedApolloClient({
    fetchWithAuth: saleorAuthClient.fetchWithAuth,
    uri: API_URI,
    typePolicies,
  });

  useEffect(() => {
    // hack for react-native app
    if (refreshToken) {
      // @ts-ignore
      saleorAuthClient.storageHandler.setRefreshToken(refreshToken);
      // @ts-ignore
      saleorAuthClient.storageHandler?.setAuthState("signedIn");
    }
  }, [refreshToken]);

  useAuthChange({
    saleorApiUrl: API_URI,
    onSignedOut: () => reset(),
    onSignedIn: () => refetch(),
  });

  return (
    <SaleorAuthProvider {...useSaleorAuthClientProps}>
      <ApolloProvider client={apolloClient}>
        <CheckoutProvider>
          <RegionsProvider>
            <BaseSeo />
            <NextNProgress color="#5B68E4" options={{ showSpinner: false }} />
            {getLayout(<Component {...pageProps} />, router)}
          </RegionsProvider>
        </CheckoutProvider>
      </ApolloProvider>
    </SaleorAuthProvider>
  );
}

MyApp.getInitialProps = async (context: AppContext) => {
  const { ctx } = context;
  console.log("ctx.req?.headers::: ", ctx.req?.headers);
  let host = ctx.req?.headers["x-forwarded-server"] || ctx.req?.headers.host;
  if (isArray(host)) {
    host = host[0];
  }
  const { API_URI } = getSubdomain(host!);
  const pageProps = await App.getInitialProps(context);
  return { pageProps, API_URI };
};

export default MyApp;
