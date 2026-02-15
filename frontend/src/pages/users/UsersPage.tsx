import {useCurrentUserContext} from "../../lib/userContext/userContext.ts";

export const UsersPage = () => {
  const user = useCurrentUserContext();

  return <div>{user?.name}</div>;
};
