import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import typePolicies from "../auth/typePolicies";
import { API_URI } from "../const";

export const serverApolloClient = () => {
  console.log("process.env.API_URI:::: ", API_URI);
  return new ApolloClient({
    link: createHttpLink({ uri: API_URI }),
    cache: new InMemoryCache({ typePolicies }),
    ssrMode: true,
  });
};
