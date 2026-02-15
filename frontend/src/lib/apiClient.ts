import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";
import {SetContextLink} from "@apollo/client/link/context";

const authLink = new SetContextLink(({headers}) => {
  const token = sessionStorage.getItem("token");

  return {
    headers: {
      ...headers,
      Authorization: token ? `JWT ${token.trim()}` : "",
    },
  };
});

const httpLink = new HttpLink({uri: "http://0.0.0.0:8000/graphql"});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
