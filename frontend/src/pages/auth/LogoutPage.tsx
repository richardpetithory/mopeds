import {useUserContext} from "@/lib/userContext/userContext.ts"
import {Navigate} from "react-router"

export const LogoutPage = () => {
  const {setToken} = useUserContext()

  setToken(null)

  return <Navigate to={"/"} replace />
}
