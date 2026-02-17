import {AppLayout} from "@/components/layout/AppLayout.tsx"
import {client} from "@/lib/apiClient.ts"
import {UserContextProvider} from "@/lib/userContext/UserContextProvider.tsx"
import {LoginPage} from "@/pages/auth/LoginPage.tsx"
import {LogoutPage} from "@/pages/auth/LogoutPage.tsx"
import {NotFoundPage} from "@/pages/NotFound.tsx"
import {ApolloProvider} from "@apollo/client/react"
import {StrictMode} from "react"
import {createBrowserRouter, type RouteObject, RouterProvider} from "react-router"

const routes: RouteObject[] = [
  {
    path: "/",
    handle: {path: "/"},
    element: <AppLayout />,
    children: [
      {index: true, element: <div>Home</div>},
      {path: "login", element: <LoginPage />},
      {path: "logout", element: <LogoutPage />},
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]

export const App = () => {
  return (
    <StrictMode>
      <ApolloProvider client={client}>
        <UserContextProvider>
          <RouterProvider router={createBrowserRouter(routes)} />
        </UserContextProvider>
      </ApolloProvider>
    </StrictMode>
  )
}
