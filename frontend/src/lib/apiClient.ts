import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"
import {SetContextLink} from "@apollo/client/link/context"
import {ErrorLink} from "@apollo/client/link/error"

const DEVELOPMENT_MODE = import.meta.env.MODE === "development"

// const authLink = new SetContextLink(({headers}) => {
//   const token = window.localStorage.getItem("token")
//
//   const extraHeaders = token ? {Authorization: `JWT ${token.trim()}`} : {}
//
//   return {
//     headers: {
//       ...headers,
//       ...extraHeaders,
//     },
//   }
// })
//
// const errorLink = new ErrorLink(({error, forward, operation}) => {
//   if (CombinedGraphQLErrors.is(error)) {
//     error.errors.forEach(({message, locations, path}) =>
//       console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
//     )
//     return forward(operation)
//   } else if (CombinedProtocolErrors.is(error)) {
//     error.errors.forEach(({message, extensions}) =>
//       console.log(`[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(extensions)}`)
//     )
//   } else {
//     console.error(`[Network error]: ${error}`)
//   }
// })
//
// const httpLink = new HttpLink({uri: `${DEVELOPMENT_MODE ? "http://0.0.0.0:8000" : ""}/graphql`})

export const getClient = (setShowNotFound: (show: boolean) => void) => {
  return new ApolloClient({
    link: ApolloLink.from([
      new ErrorLink(({error, forward, operation}) => {
        if (CombinedGraphQLErrors.is(error)) {
          error.errors.forEach(({message, locations, path, extensions}) => {
            if (extensions?.code == "NOT_FOUND") setShowNotFound(true)

            console.debug(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
          })
          return forward(operation)
        } else if (CombinedProtocolErrors.is(error)) {
          error.errors.forEach(({message, extensions}) =>
            console.debug(`[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(extensions)}`)
          )
        } else {
          console.error(`[Network error]: ${error}`)
        }
      }),
      new SetContextLink(({headers}) => {
        const token = window.localStorage.getItem("token")

        const extraHeaders = token ? {Authorization: `JWT ${token.trim()}`} : {}

        return {
          headers: {
            ...headers,
            ...extraHeaders,
          },
        }
      }),
      new HttpLink({uri: `${DEVELOPMENT_MODE ? "http://0.0.0.0:8000" : ""}/graphql`}),
    ]),
    cache: new InMemoryCache(),
  })
}
