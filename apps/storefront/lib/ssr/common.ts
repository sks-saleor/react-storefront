import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import typePolicies from "../auth/typePolicies";

export const serverApolloClient = () => {
  return new ApolloClient({
    link: createHttpLink({
      uri: process.env.API_URI,
    }),
    cache: new InMemoryCache({ typePolicies }),
    ssrMode: true,
  });
};
