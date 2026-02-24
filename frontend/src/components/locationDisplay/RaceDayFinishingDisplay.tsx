import {LocationDisplay} from "@/components/locationDisplay/LocationDisplay.tsx"
import type {Coordinates} from "@/lib/types.ts"

export type FinishingLocationDisplayValues = {
  finishingAddress: string
  finishingAddressCoordinates: Coordinates
  finishingLocation: string
}

interface RaceDayFinishingDisplayProps {
  locationValues: FinishingLocationDisplayValues
}

export const RaceDayFinishingDisplay = ({locationValues}: RaceDayFinishingDisplayProps) => {
  return (
    <LocationDisplay
      location={locationValues.finishingLocation}
      address={locationValues.finishingAddress}
      addressCoordinates={locationValues.finishingAddressCoordinates}
    />
  )
}
