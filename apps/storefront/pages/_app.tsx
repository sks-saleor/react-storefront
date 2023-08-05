import "styles/sks-fonts.css";
import "styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { NextPage } from "next";
import { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import React, { ReactElement, ReactNode, useEffect } from "react";

import { RegionsProvider } from "@/components/RegionsProvider";
import { BaseSeo } from "@/components/seo/BaseSeo";
import typePolicies from "@/lib/auth/typePolicies";
import { API_URI } from "@/lib/const";
import { CheckoutProvider } from "@/lib/providers/CheckoutProvider";
import { SaleorAuthProvider, useAuthChange, useSaleorAuthClient } from "@saleor/auth-sdk/react";
import { useAuthenticatedApolloClient } from "@/lib/hooks/useAuthenticatedApolloClient";
import { getQueryParams } from "@/lib/url";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement, router?: AppProps["router"]) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps, router }: AppPropsWithLayout) {
  // console.log("MyApp::: ", API_URI, process.env.API_URI);

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

export default MyApp;
