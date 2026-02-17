import type {User} from "@/lib/types/mopeds.ts"

export type Race = {
  id: number
  year: string
  name: string
}

export type RaceDay = {
  id: number
  race: Race
  day: number
}

export type Team = {
  id: number
  name: string
  description: string
  captain: User
}

export type TeamMembership = {
  team: Team
  member: User
  race: Race
}

export type RaceTeam = {
  id: number
  race: Race
  team: Team
}

export type RaceTeamTime = {
  id: number
  day: number
  raceTeam: RaceTeam
  durationHours: string
  dnf: boolean
}
