import {LocationDisplay} from "@/components/locationDisplay/LocationDisplay.tsx"
import type {Coordinates} from "@/lib/types.ts"

export type StartingLocationDisplayValues = {
  startingAddress: string
  startingAddressCoordinates: Coordinates
  startingLocation: string
}

interface RaceDayStartingDisplayProps {
  locationValues: StartingLocationDisplayValues
}

export const RaceDayStartingDisplay = ({locationValues}: RaceDayStartingDisplayProps) => {
  return (
    <LocationDisplay
      location={locationValues.startingLocation}
      address={locationValues.startingAddress}
      addressCoordinates={locationValues.startingAddressCoordinates}
    />
  )
}
