import {gql} from "@apollo/client"
import {createContext, useContext} from "react"

export interface CurrentUserInfo {
  id: number | null
  name: string
  email: string
  dateJoined: string
  isActive: boolean
  isStaff: boolean
  isSuperuser: boolean
  lastLogin: string | null
}

interface UserContextInterface {
  token: string | null
  setToken: (token: string | null) => void
  currentUser: CurrentUserInfo | null
}

export interface CurrentUserInfoResponse {
  currentUser: CurrentUserInfo
}

export const GQL_CURRENT_USER_INFO = gql`
  query CurrentUserInfo {
    currentUser {
      id
      name
      email
      dateJoined
      isActive
      isStaff
      isSuperuser
      lastLogin
    }
  }
`

export const UserContext = createContext<UserContextInterface>({
  token: null,
  setToken: () => {},
  currentUser: null,
})

export const useUserContext = (): UserContextInterface => {
  return useContext(UserContext)
}
