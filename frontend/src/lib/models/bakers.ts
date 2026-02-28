import type {Rider} from "@/lib/models/users.ts"
import type {Coordinates} from "@/lib/types.ts"

export type Race = {
  id: string
  year: string
  name: string
  description: string
  meetupDatetime: Date
  meetupAddress: string
  meetupAddressCoordinates: Coordinates
  meetupLocation: string
  meetupDescription: string
}

export type RaceDay = {
  id: string
  previousDay: RaceDay | null
  nextDay: RaceDay | null
  race: Race
  dayNumber: number
  description: string
  dayOff: boolean
  startingDatetime: Date
  startingIsPreviousFinish: boolean
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
