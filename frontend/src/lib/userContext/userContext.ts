import {gql} from "@apollo/client";
import {createContext, useContext} from "react";

export interface CurrentUserInfo {
  id: number | null;
  name: string;
}

export interface CurrentUserInfoResponse {
  me: CurrentUserInfo;
}

export const GQL_CURRENT_USER_INFO = gql`
  query CurrentUserInfo {
    me {
      id
      name
      email
      dateJoined
      isActive
      isStaff
      isSuperuser
      lastLogin
      #      memberships
      #      teamSet
    }
  }
`;

export const UserContext = createContext<CurrentUserInfo | null>(null);

export const useCurrentUserContext = (): CurrentUserInfo | null => {
  return useContext(UserContext);
};
