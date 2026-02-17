import {AppLayout} from "@/components/layout/AppLayout.tsx"
import {client} from "@/lib/apiClient.ts"
import {UserContextProvider} from "@/lib/userContext/UserContextProvider.tsx"
import {LoginPage} from "@/pages/auth/LoginPage.tsx"
import {LogoutPage} from "@/pages/auth/LogoutPage.tsx"
import {RaceDays} from "@/pages/bakers/races/RaceDays.tsx"
import {Races} from "@/pages/bakers/races/Races.tsx"
import {RaceTeamTimes} from "@/pages/bakers/races/RaceTeamTimes.tsx"
import {NotFoundPage} from "@/pages/NotFound.tsx"
import {ApolloProvider} from "@apollo/client/react"
import {StrictMode} from "react"
import {createBrowserRouter, Navigate, type RouteObject, RouterProvider} from "react-router"

const routes: RouteObject[] = [
  {
    path: "/",
    handle: {path: "/"},
    element: <AppLayout />,
    children: [
      {index: true, element: <Navigate to={"bakers"} />},
      {path: "login", element: <LoginPage />},
      {path: "logout", element: <LogoutPage />},
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "bakers",
        children: [
          {index: true, element: <Navigate to={"races"} />},
          {path: "races", element: <Races />},
          {path: "races/:racePk", element: <RaceDays />},
          {path: "races/:racePk/:day", element: <RaceTeamTimes />},
        ],
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
