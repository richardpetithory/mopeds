import {useQuery} from "@apollo/client/react";
import {type PropsWithChildren} from "react";
import {type CurrentUserInfoResponse, GQL_CURRENT_USER_INFO, UserContext} from "./userContext.ts";

export const UserContextProvider = ({children}: PropsWithChildren) => {
  const {data, loading} = useQuery<CurrentUserInfoResponse>(GQL_CURRENT_USER_INFO);

  if (!data || loading) {
    return null;
  }

  return <UserContext.Provider value={data.me}>{children}</UserContext.Provider>;
};
