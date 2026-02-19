import {AppLayout} from "@/components/layout/AppLayout.tsx"
import {LoginPage} from "@/pages/auth/LoginPage.tsx"
import {LogoutPage} from "@/pages/auth/LogoutPage.tsx"
import {RaceEdit} from "@/pages/bakers/RaceEdit.tsx"
import {RacePage} from "@/pages/bakers/RacePage.tsx"
import {RacesPage} from "@/pages/bakers/RacesPage.tsx"
import {RaceTeamTimesPage} from "@/pages/bakers/RaceTeamTimesPage.tsx"
import {TeamPage} from "@/pages/bakers/TeamPage.tsx"
import {TeamsPage} from "@/pages/bakers/TeamsPage.tsx"
import {NotFoundPage} from "@/pages/NotFoundPage.tsx"
import {Navigate, type RouteObject} from "react-router"

export const PATH_RACES = "/bakers/races"
export const PATH_TEAMS = "/bakers/teams"
export const PATH_LOGIN = "/login"

export const routes: RouteObject[] = [
  {
    path: "/",
    handle: {path: "/"},
    element: <AppLayout />,
    children: [
      {index: true, element: <Navigate to={"bakers"} />},
      {path: PATH_LOGIN, element: <LoginPage />},
      {path: "logout", element: <LogoutPage />},
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "bakers",
        children: [
          {index: true, element: <Navigate to={"races"} />},
          {path: PATH_RACES, element: <RacesPage />},
          {path: PATH_RACES + "/new", element: <RaceEdit />},
          {path: PATH_RACES + "/:raceId", element: <RacePage />},
          {path: PATH_RACES + "/:raceId/edit", element: <RaceEdit />},
          {path: PATH_RACES + "/:raceId/:day", element: <RaceTeamTimesPage />},
          {path: PATH_TEAMS, element: <TeamsPage />},
          {path: PATH_TEAMS + "/:teamId", element: <TeamPage />},
        ],
      },
    ],
  },
]
