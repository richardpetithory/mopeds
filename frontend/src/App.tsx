import {AppLayout} from "@/components/layout/AppLayout.tsx"
import {client} from "@/lib/apiClient.ts"
import {UserContextProvider} from "@/lib/userContext/UserContextProvider.tsx"
import {LoginPage} from "@/pages/auth/LoginPage.tsx"
import {LogoutPage} from "@/pages/auth/LogoutPage.tsx"
import {RaceDaysPage} from "@/pages/bakers/RaceDaysPage.tsx"
import {RacesPage} from "@/pages/bakers/RacesPage.tsx"
import {RaceTeamTimesPage} from "@/pages/bakers/RaceTeamTimesPage.tsx"
import {TeamPage} from "@/pages/bakers/TeamPage.tsx"
import {TeamsPage} from "@/pages/bakers/TeamsPage.tsx"
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
          {path: "races", element: <RacesPage />},
          {path: "races/:racePk", element: <RaceDaysPage />},
          {path: "races/:racePk/:day", element: <RaceTeamTimesPage />},
          {path: "teams", element: <TeamsPage />},
          {path: "teams/:pk", element: <TeamPage />},
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
