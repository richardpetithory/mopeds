import {Outlet} from "react-router"
import {AuthLayout as CatalystAuthLayout} from "../../../catalyst/auth-layout.tsx"

export const AuthLayout = () => {
  return (
    <CatalystAuthLayout>
      <Outlet />
    </CatalystAuthLayout>
  )
}
