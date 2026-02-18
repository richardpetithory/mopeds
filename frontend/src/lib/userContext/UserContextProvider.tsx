import {useLazyQuery} from "@apollo/client/react"
import {type PropsWithChildren, useEffect, useState} from "react"
import {type CurrentUserInfo, type CurrentUserInfoResponse, GQL_CURRENT_USER_INFO, UserContext} from "./userContext.ts"

export const UserContextProvider = ({children}: PropsWithChildren) => {
  const [token, setToken_] = useState<string | null>(localStorage.getItem("token"))
  const [currentUser, setCurrentUser] = useState<CurrentUserInfo | null>(null)

  const [getCurrentUserQuery] = useLazyQuery<CurrentUserInfoResponse>(GQL_CURRENT_USER_INFO)

  useEffect(() => {
    getCurrentUserQuery({
      context: {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    }).then((currentUserInfo) => {
      setCurrentUser(currentUserInfo?.data?.currentUser || null)
    })
  }, [getCurrentUserQuery, token])

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken)
    } else {
      localStorage.removeItem("token")
    }

    setToken_(newToken)
  }

  const contextValue = {
    token,
    setToken,
    currentUser: currentUser,
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}
