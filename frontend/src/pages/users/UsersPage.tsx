import {useUserContext} from "@/lib/userContext/userContext.ts"

export const UsersPage = () => {
  const user = useUserContext()

  return <div>{user?.name}</div>
}
