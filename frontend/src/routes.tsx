import {Layout} from "@/components/Layout.tsx"
import {LoginPage} from "@/pages/auth/LoginPage.tsx"
import {LogoutPage} from "@/pages/auth/LogoutPage.tsx"
import {RegisterPage} from "@/pages/auth/RegisterPage.tsx"
import {RaceDayEdit} from "@/pages/bakers/races/RaceDayEdit.tsx"
import {RaceDayPage} from "@/pages/bakers/races/RaceDayPage.tsx"
import {RaceEdit} from "@/pages/bakers/races/RaceEdit.tsx"
import {RacePage} from "@/pages/bakers/races/RacePage.tsx"
import {RacesPage} from "@/pages/bakers/races/RacesPage.tsx"
import {RaceTeamTimeEdit} from "@/pages/bakers/races/RaceTeamTimeEdit.tsx"
import {RiderPage} from "@/pages/bakers/riders/RiderPage.tsx"
import {RidersPage} from "@/pages/bakers/riders/RidersPage.tsx"
import {RaceTeamEdit} from "@/pages/bakers/teams/RaceTeamEdit.tsx"
import {RaceTeamMembershipInvite} from "@/pages/bakers/teams/RactTeamInvite.tsx"
import {TeamEdit} from "@/pages/bakers/teams/TeamEdit.tsx"
import {TeamPage} from "@/pages/bakers/teams/TeamPage.tsx"
import {TeamsPage} from "@/pages/bakers/teams/TeamsPage.tsx"
import {NotFoundPage} from "@/pages/NotFoundPage.tsx"
import {Navigate, type RouteObject} from "react-router"

export const PATH_RACES = "/bakers/races"
export const PATH_TEAMS = "/bakers/teams"
export const PATH_RIDERS = "/riders"
export const PATH_REGISTER = "/register"
export const PATH_LOGIN = "/login"
export const PATH_LOGOUT = "/logout"

export const routes: RouteObject[] = [
  {
    path: "/",
    handle: {path: "/"},
    element: <Layout />,
    children: [
      {index: true, element: <Navigate to={PATH_RACES} />},
      {path: PATH_REGISTER, element: <RegisterPage />},
      {path: PATH_LOGIN, element: <LoginPage />},
      {path: PATH_LOGOUT, element: <LogoutPage />},
      {
        path: "bakers",
        children: [
          {index: true, element: <Navigate to={PATH_RACES} />},
          {path: PATH_RACES, element: <RacesPage />},
          {path: PATH_RACES + "/new", element: <RaceEdit />},
          {path: PATH_RACES + "/:raceId", element: <RacePage />},
          {path: PATH_RACES + "/:raceId/edit", element: <RaceEdit />},
          {path: PATH_RACES + "/:raceId/new", element: <RaceDayEdit />},
          {path: PATH_RACES + "/:raceId/:dayId", element: <RaceDayPage />},
          {path: PATH_RACES + "/:raceId/:dayId/edit", element: <RaceDayEdit />},
          {path: PATH_RACES + "/:raceId/:dayId/new", element: <RaceTeamTimeEdit />},
          {path: PATH_RACES + "/:raceId/:dayId/:raceTeamId", element: <RaceTeamTimeEdit />},

          {path: PATH_TEAMS, element: <TeamsPage />},
          {path: PATH_TEAMS + "/new", element: <TeamEdit />},
          {path: PATH_TEAMS + "/:teamId", element: <TeamPage />},
          {path: PATH_TEAMS + "/:teamId/joinRace", element: <RaceTeamEdit />},
          {path: PATH_TEAMS + "/:teamId/edit", element: <TeamEdit />},
          {path: PATH_TEAMS + "/:teamId/invite", element: <RaceTeamMembershipInvite />},
        ],
      },
      {
        path: "riders",
        children: [
          {index: true, element: <RidersPage />},
          {path: ":riderId", element: <RiderPage />},
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]
