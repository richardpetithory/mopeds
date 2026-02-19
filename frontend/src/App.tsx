import {client} from "@/lib/apiClient.ts"
import {UserContextProvider} from "@/lib/userContext/UserContextProvider.tsx"
import {routes} from "@/routes.tsx"
import {mantineTheme} from "@/theme.ts"
import {ApolloProvider} from "@apollo/client/react"
import {MantineProvider} from "@mantine/core"
import {StrictMode} from "react"
import {createBrowserRouter, RouterProvider} from "react-router"

export const App = () => {
  return (
    <StrictMode>
      <ApolloProvider client={client}>
        <MantineProvider theme={mantineTheme} defaultColorScheme="dark">
          <UserContextProvider>
            <RouterProvider router={createBrowserRouter(routes)} />
          </UserContextProvider>
        </MantineProvider>
      </ApolloProvider>
    </StrictMode>
  )
}
