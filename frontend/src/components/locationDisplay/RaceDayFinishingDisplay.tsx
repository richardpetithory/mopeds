import {LocationDisplay} from "@/components/locationDisplay/LocationDisplay.tsx"
import type {RaceDay} from "@/lib/models/bakers.ts"

interface RaceDayFinishingDisplayProps {
  raceDay: RaceDay
}

export const RaceDayFinishingDisplay = ({raceDay}: RaceDayFinishingDisplayProps) => (
  <LocationDisplay
    location={raceDay.finishingLocation}
    address={raceDay.finishingAddress}
    addressCoordinates={raceDay.finishingAddressCoordinates}
  />
)
