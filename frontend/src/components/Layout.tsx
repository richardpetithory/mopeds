import {useRiderContext} from "@/lib/userContext/riderContext.ts"
import {PATH_LOGIN, PATH_RACES, PATH_RIDERS, PATH_TEAMS} from "@/routes.tsx"
import {AppShell, NavLink} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks"
import {isArray, some} from "lodash"
import {LuDonut} from "react-icons/lu"
import {Link, Outlet, ScrollRestoration, useLocation} from "react-router"

import logo from "@/assets/logo.png"

export const Layout = () => {
  const {currentRider} = useRiderContext()
  const {pathname} = useLocation()
  const [opened, {toggle}] = useDisclosure()

  const isActive = (navPath: string | string[]) =>
    some(isArray(navPath) ? navPath : [navPath], (path) => {
      const matches = pathname.startsWith(path)
      if (isArray(navPath)) console.log(pathname, path, matches)
      return matches
    })

  return (
    <AppShell
      padding="md"
      header={{height: 60}}
      navbar={{
        width: 160,
        breakpoint: "sm",
        collapsed: {mobile: !opened},
      }}
    >
      <AppShell.Header>
        {/*<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"></Burger>*/}

        <Link to={"/"} className={"flex h-full items-center cursor-pointer"} onClick={toggle}>
          <img src={logo} alt={"logo"} className={"ms-3"} height={32} width={32} />
        </Link>
        {/*<div className={"flex h-full items-center cursor-pointer"} role={"button"} onClick={toggle}>*/}
        {/*  <img src={logo} alt={"logo"} className={"ms-3"} height={32} width={32} />*/}
        {/*</div>*/}
      </AppShell.Header>

      <AppShell.Navbar>
        <NavLink label="Bakers" leftSection={<LuDonut />} childrenOffset={28} defaultOpened={true}>
          <NavLink label="Races" component={Link} to={"/bakers/races"} active={isActive(PATH_RACES)} />
          <NavLink label="Teams" component={Link} to={"/bakers/teams"} active={isActive(PATH_TEAMS)} />
        </NavLink>
        <NavLink label="Riders" component={Link} to={"/riders"} active={isActive(PATH_RIDERS)} />
        {!currentRider?.id && <NavLink label="Log In" component={Link} to={"/login"} active={isActive(PATH_LOGIN)} />}
        {currentRider?.id && <NavLink label="Log Out" component={Link} to={"/logout"} />}
      </AppShell.Navbar>

      <AppShell.Main>
        <ScrollRestoration />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
