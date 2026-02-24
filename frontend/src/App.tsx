import {client} from "@/lib/apiClient.ts"
import {RiderContextProvider} from "@/lib/userContext/RiderContextProvider.tsx"
import {routes} from "@/routes.tsx"
import {mantineTheme} from "@/theme.ts"
import {ApolloProvider} from "@apollo/client/react"
import {MantineProvider} from "@mantine/core"
import {ModalsProvider} from "@mantine/modals"
import {Notifications} from "@mantine/notifications"
import {StrictMode} from "react"
import {createBrowserRouter, RouterProvider} from "react-router"

export const App = () => {
  return (
    <StrictMode>
      <ApolloProvider client={client}>
        <MantineProvider theme={mantineTheme} defaultColorScheme="dark">
          <ModalsProvider>
            <Notifications position={"top-center"} />
            <RiderContextProvider>
              <RouterProvider router={createBrowserRouter(routes)} />
            </RiderContextProvider>
          </ModalsProvider>
        </MantineProvider>
      </ApolloProvider>
    </StrictMode>
  )
}
