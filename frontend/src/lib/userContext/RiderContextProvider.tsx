import {type CurrentRiderInfoResponse, GQL_CURRENT_RIDER_INFO} from "@/lib/gql/users.ts"
import type {Rider} from "@/lib/models/users.ts"
import {useLazyQuery} from "@apollo/client/react"
import {type PropsWithChildren, useEffect, useState} from "react"
import {RiderContext} from "./riderContext.ts"

export const RiderContextProvider = ({children}: PropsWithChildren) => {
  const [token, setToken_] = useState<string | null>(localStorage.getItem("token"))
  const [currentRider, setCurrentRider] = useState<Rider | null>(null)

  const [getCurrentRiderQuery] = useLazyQuery<CurrentRiderInfoResponse>(GQL_CURRENT_RIDER_INFO)

  useEffect(() => {
    if (token) {
      getCurrentRiderQuery({
        context: {
          headers: {
            Authorization: `JWT ${token}`,
          },
        },
      }).then((currentRiderInfo) => {
        setCurrentRider(currentRiderInfo?.data?.currentRider || null)
      })
    }
  }, [getCurrentRiderQuery, token])

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken)
    } else {
      setCurrentRider(null)
      localStorage.removeItem("token")
    }

    setToken_(newToken)
  }

  const contextValue = {
    token,
    setToken,
    currentRider: currentRider,
  }

  return <RiderContext.Provider value={contextValue}>{children}</RiderContext.Provider>
}
