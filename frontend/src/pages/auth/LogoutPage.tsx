import {useRiderContext} from "@/lib/userContext/riderContext.ts"
import {useNavigate} from "react-router"

export const LogoutPage = () => {
  const navigate = useNavigate()
  const {setToken} = useRiderContext()

  setToken(null)

  navigate("/", {replace: true})

  return null
}
