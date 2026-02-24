import type {Rider} from "@/lib/models/users.ts"
import {createContext, useContext} from "react"

interface RiderContextInterface {
  token: string | null
  setToken: (token: string | null) => void
  currentRider: Rider | null
}

export const RiderContext = createContext<RiderContextInterface>({
  token: null,
  setToken: () => {},
  currentRider: null,
})

export const useRiderContext = (): RiderContextInterface => {
  return useContext(RiderContext)
}
