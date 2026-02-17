import {useUserContext} from "@/lib/userContext/userContext.ts"

export const UsersPage = () => {
  const {currentUser} = useUserContext()

  return <div>{currentUser?.name}</div>
}
