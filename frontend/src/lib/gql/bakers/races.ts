import type {Race, RaceDay, RaceTeam, RaceTeamTime} from "@/lib/models/bakers.ts"
import {gql} from "@apollo/client"

export const GQL_RACE = gql`
  query Race($id: String!) {
    race(id: $id) {
      id
      year
      name
      description
    }
  }
`

export interface RaceResponse {
  race: Race
}

// ----------------------------------------------------------------------------

export interface SaveRaceInput {
  id: string | null
  year: number
  name: string
  description?: string
}

export const GQL_RACE_MUTATION_SAVE = gql`
  mutation SaveRace($id: String, $year: Int!, $name: String!, $description: String) {
    saveRace(id: $id, year: $year, name: $name, description: $description) {
      race {
        id
        year
        name
        description
      }
    }
  }
`

export interface SaveRaceResponse {
  saveRace: {race: Race}
}

// ----------------------------------------------------------------------------

export const GQL_RACE_MUTATION_DELETE = gql`
  mutation DeleteRace($id: String) {
    deleteRace(id: $id) {
      ok
    }
  }
`

export interface DeleteRaceResponse {
  deleteRace: {ok: boolean}
}

// ----------------------------------------------------------------------------

export const GQL_RACES = gql`
  query Races {
    races {
      id
      year
      name
      description
    }
  }
`

export interface RacesResponse {
  races: Race[]
}

// ----------------------------------------------------------------------------

export const GQL_RACE_SUMMARY = gql`
  query Race($id: String!) {
    race(id: $id) {
      id
      year
      name
      description
    }
    raceDays(raceId: $id) {
      id
      dayNumber
      description
      startingAddress
      startingAddressCoordinates
      startingLocation
      finishingAddress
      finishingAddressCoordinates
      finishingLocation
    }
    raceSummary(raceId: $id) {
      teamId
      teamName
      totalDurationHours
    }
  }
`

export interface RaceSummary {
  teamId: number
  teamName: string
  totalDurationHours: string
}

export interface RaceSummaryResponse {
  race: Race
  raceDays: RaceDay[]
  raceSummary: RaceSummary[]
}

// ----------------------------------------------------------------------------

export const GQL_RACE_DAY = gql`
  query RaceDay($id: String!) {
    raceDay(id: $id) {
      id
      dayNumber
      description
      startingDatetime
      startingAddress
      startingAddressCoordinates
      startingLocation
      finishingAddress
      finishingAddressCoordinates
      finishingLocation
    }
  }
`

export interface RaceDayResponse {
  raceDay: RaceDay
}

// ----------------------------------------------------------------------------

export interface SaveRaceDayInput {
  raceId: string
  dayId: string
  dayNumber: number | null
  description: string
  startingDatetime: Date
  startingAddress: string
  startingAddressCoordinates: string
  startingLocation: string
  finishingAddress: string
  finishingAddressCoordinates: string
  finishingLocation: string
  commentary: string
}

export const GQL_RACE_DAY_MUTATION_SAVE = gql`
  mutation SaveRaceDay(
    $id: String
    $raceId: String!
    $dayNumber: Int
    $description: String
    $startingDatetime: DateTime
    $startingAddress: String
    $startingAddressCoordinates: String
    $startingLocation: String
    $finishingLocation: String
    $finishingAddress: String
    $finishingAddressCoordinates: String
    $commentary: String
  ) {
    saveRaceDay(
      id: $id
      raceId: $raceId
      dayNumber: $dayNumber
      description: $description
      startingDatetime: $startingDatetime
      startingAddress: $startingAddress
      startingAddressCoordinates: $startingAddressCoordinates
      startingLocation: $startingLocation
      finishingAddress: $finishingAddress
      finishingAddressCoordinates: $finishingAddressCoordinates
      finishingLocation: $finishingLocation
      commentary: $commentary
    ) {
      raceDay {
        id
        dayNumber
        description
        startingDatetime
        startingAddress
        startingAddressCoordinates
        startingLocation
        finishingLocation
        finishingAddress
        finishingAddressCoordinates
        commentary
      }
    }
  }
`

export interface SaveRaceDayResponse {
  saveRaceDay: {
    raceDay: RaceDay
  }
}

// ----------------------------------------------------------------------------

export const GQL_RACE_DAY_SUMMARY = gql`
  query RaceDaySummary($raceId: String!, $dayId: String!) {
    raceDay(id: $dayId) {
      id
      dayNumber
      description
      startingDatetime
      startingAddress
      startingAddressCoordinates
      startingLocation
      finishingAddress
      finishingAddressCoordinates
      finishingLocation
      commentary
    }
    race(id: $raceId) {
      id
      year
      name
    }
    raceTeamTimes(raceId: $raceId, dayId: $dayId) {
      id
      day {
        dayNumber
      }
      raceTeam {
        team {
          id
          name
        }
      }
      finishTime
      dnf
    }
  }
`

export interface RaceDaySummaryResponse {
  raceDay: RaceDay
  race: Race
  raceTeamTimes: RaceTeamTime[]
}

// ----------------------------------------------------------------------------

export const GQL_RACE_DAY_MUTATION_DELETE = gql`
  mutation DeleteRaceDay($id: String!) {
    deleteRaceDay(id: $id) {
      ok
    }
  }
`

export interface DeleteRaceDayResponse {
  deleteRaceDay: {
    ok: boolean
  }
}

// ----------------------------------------------------------------------------

export const GQL_RACE_TEAM_TIME = gql`
  query RaceTeamTime($raceId: String!, $dayId: String!, $raceTeamId: String!) {
    raceTeamTime(raceId: $raceId, dayId: $dayId, raceTeamId: $raceTeamId) {
      id
      raceTeam {
        race {
          id
        }
        team {
          id
        }
      }
      finishTime
      dnf
      commentary
    }
    raceTeamsWithoutTimes(raceId: $raceId, dayId: $dayId) {
      id
      team {
        name
      }
    }
  }
`

export interface RaceTeamTimeResponse {
  raceTeamTime: RaceTeamTime
  raceTeamsWithoutTimes: RaceTeam[]
}

// ----------------------------------------------------------------------------

export interface SaveRaceTeamTimeInput {
  id: string | null
  dayId: string
  raceTeamId: string
  finishTime: string
  dnf: boolean
  commentary: string
}

export const GQL_RACE_TEAM_TIME_MUTATION_SAVE = gql`
  mutation SaveRaceTeamTime(
    $id: String
    $dayId: String!
    $raceTeamId: String!
    $finishTime: String!
    $dnf: Boolean!
    $commentary: String!
  ) {
    saveRaceTeamTime(
      id: $id
      dayId: $dayId
      raceTeamId: $raceTeamId
      finishTime: $finishTime
      dnf: $dnf
      commentary: $commentary
    ) {
      raceTeamTime {
        id
      }
    }
  }
`

export interface SaveRaceTeamTimeResponse {
  saveRaceTeamTime: {
    raceTeamTime: RaceTeamTime
  }
}

// ----------------------------------------------------------------------------

export const GQL_RACE_TEAMS_WITHOUT_TIMES = gql`
  query RaceTeamsWithoutTimes($raceId: String!, $dayId: String!) {
    raceTeamsWithoutTimes(raceId: $raceId, dayId: $dayId) {
      id
      team {
        name
      }
    }
  }
`

export interface RaceTeamTimeResponse {
  raceTeamsWithoutTimes: RaceTeam[]
}
