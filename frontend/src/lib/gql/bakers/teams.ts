import type {RaceTeam, RaceTeamMembership, Team} from "@/lib/models/bakers.ts"
import {gql} from "@apollo/client"

export const GQL_TEAM = gql`
  query Team($id: String!) {
    team(id: $id) {
      id
      name
      description
      manager {
        id
        name
      }
    }
  }
`

export interface TeamResponse {
  team: Team
}

// ----------------------------------------------------------------------------

export interface SaveTeamInput {
  id: string | null
  name: string
  description: string
  managerId: string | null
}

export const GQL_TEAM_MUTATION = gql`
  mutation SaveTeam($id: String, $name: String!, $description: String, $managerId: String) {
    saveTeam(id: $id, name: $name, description: $description, managerId: $managerId) {
      team {
        id
        name
        description
        manager {
          id
          name
        }
      }
    }
  }
`

export interface SaveTeamResponse {
  saveTeam: {
    team: Team
  }
}

// ----------------------------------------------------------------------------

export const GQL_TEAM_SUMMARY = gql`
  query Team($teamId: String!, $invited: Boolean) {
    team(id: $teamId) {
      id
      name
      description
      manager {
        id
        name
      }
    }
    teamRaces(teamId: $teamId) {
      team {
        name
      }
      race {
        id
        year
        name
      }
    }
    raceTeamMemberships(teamId: $teamId, invited: $invited) {
      member {
        id
        name
      }
      race {
        id
        year
        name
      }
      invited
    }
  }
`

export interface TeamSummaryResponse {
  team: Team
  teamRaces: RaceTeam[]
  raceTeamMemberships: RaceTeamMembership[]
}

// ----------------------------------------------------------------------------

export const GQL_TEAMS = gql`
  query Teams {
    teams {
      id
      name
    }
  }
`

export interface TeamsResponse {
  teams: Team[]
}

// ----------------------------------------------------------------------------

export interface RaceTeamMembershipInvitationInput {
  teamId: string | null
  memberId: string | null
  raceId: string | null
}

export const GQL_TEAM_RACE_MEMBERSHIP_INVITATION_MUTATION = gql`
  mutation TeamRaceMembershipInvitation($teamId: String!, $raceId: String!, $memberId: String!) {
    saveTeamRaceMembership(teamId: $teamId, raceId: $raceId, memberId: $memberId) {
      raceTeamMembership {
        member {
          id
          name
        }
        team {
          id
          name
        }
        invited
      }
    }
  }
`

export interface SaveTeamRaceMemberShipInvitationResponse {
  saveTeamRaceMembership: {
    raceTeamMembership: RaceTeamMembership
  }
}

// ----------------------------------------------------------------------------

export interface RaceTeamInput {
  teamId: string | null
  raceId: string | null
}

export const GQL_RACE_TEAM_MUTATION = gql`
  mutation RaceTeam($teamId: String!, $raceId: String!) {
    saveTeamRace(teamId: $teamId, raceId: $raceId) {
      teamRace {
        team {
          id
          name
        }
      }
    }
  }
`

export interface SaveRaceTeamResponse {
  saveTeamRace: {
    teamRace: RaceTeam
  }
}

// ----------------------------------------------------------------------------

export const GQL_TEAM_RACES = gql`
  query TeamRaces($teamId: String!) {
    teamRaces(teamId: $teamId) {
      team {
        id
        name
      }
    }
  }
`

export interface TeamsResponse {
  teams: Team[]
}
