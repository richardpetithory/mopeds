import {getClient} from "@/lib/apiClient.ts"
import {NotFoundContext} from "@/lib/NotFoundContext"
import {RiderContextProvider} from "@/lib/userContext/RiderContextProvider.tsx"
import {routes} from "@/routes.tsx"
import {mantineTheme} from "@/theme.ts"
import {ApolloProvider} from "@apollo/client/react"
import {MantineProvider} from "@mantine/core"
import {ModalsProvider} from "@mantine/modals"
import {Notifications} from "@mantine/notifications"
import {StrictMode, useState} from "react"
import {createBrowserRouter, RouterProvider} from "react-router"

export const App = () => {
  const [notFound, setNotFound] = useState(false)
  const client = getClient(setNotFound)

  return (
    <StrictMode>
      <NotFoundContext.Provider value={{notFound, setNotFound}}>
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
      </NotFoundContext.Provider>
    </StrictMode>
  )
}
