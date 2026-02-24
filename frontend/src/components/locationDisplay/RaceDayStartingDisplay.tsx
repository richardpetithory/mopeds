import {LocationDisplay} from "@/components/locationDisplay/LocationDisplay.tsx"
import type {RaceDay} from "@/lib/models/bakers.ts"

interface RaceDayStartingDisplayProps {
  raceDay: RaceDay
}

export const RaceDayStartingDisplay = ({raceDay}: RaceDayStartingDisplayProps) => (
  <LocationDisplay
    location={raceDay.startingLocation}
    address={raceDay.startingAddress}
    addressCoordinates={raceDay.startingAddressCoordinates}
  />
)
