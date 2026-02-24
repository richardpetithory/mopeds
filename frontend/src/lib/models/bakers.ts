import type {Rider} from "@/lib/models/users.ts"
import type {Coordinates} from "@/lib/types.ts"

export type Race = {
  id: string
  year: number
  name: string
  description: string
}

export type RaceDay = {
  id: string
  race: Race
  dayNumber: number
  description: string
  startingDatetime: Date
  startingAddress: string
  startingAddressCoordinates: Coordinates
  startingLocation: string
  finishingAddress: string
  finishingAddressCoordinates: Coordinates
  finishingLocation: string
  commentary: string
}

export type Team = {
  id: string
  name: string
  description: string
  manager: Rider
}

export type RaceTeamMembership = {
  id: string
  team: Team
  member: Rider
  race: Race
}

export type RaceTeam = {
  id: string
  race: Race
  team: Team
}

export type RaceTeamTime = {
  id: string
  day: RaceDay
  raceTeam: RaceTeam
  finishTime: string
  dnf: boolean
  commentary: string
}
