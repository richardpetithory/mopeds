import {ApolloClient, CombinedGraphQLErrors, CombinedProtocolErrors, HttpLink, InMemoryCache} from "@apollo/client"
import {SetContextLink} from "@apollo/client/link/context"
import {ErrorLink} from "@apollo/client/link/error"

const authLink = new SetContextLink(({headers}) => {
  const token = localStorage.getItem("token")

  return {
    headers: {
      ...headers,
      Authorization: token ? `JWT ${token.trim()}` : "",
    },
  }
})

const errorLink = new ErrorLink(({error, forward, operation}) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({message, locations, path}) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    )
    return forward(operation)
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({message, extensions}) =>
      console.log(`[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(extensions)}`)
    )
  } else {
    console.error(`[Network error]: ${error}`)
  }
})

const httpLink = new HttpLink({uri: "http://0.0.0.0:8000/graphql"})

export const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
})
