import {PATH_LOGIN, PATH_RACES, PATH_TEAMS} from "@/routes.tsx"
import {AppShell, Burger, NavLink} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks"
import {isArray, some} from "lodash"
import {LuDonut} from "react-icons/lu"
import {Link, Outlet, ScrollRestoration, useLocation} from "react-router"

export const AppLayout = () => {
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
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <div>mopeds.lol</div>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavLink label="Bakers" leftSection={<LuDonut />} childrenOffset={28} defaultOpened={true}>
          <NavLink label="Races" component={Link} to={"/bakers/races"} active={isActive(PATH_RACES)} />
          <NavLink label="Teams" component={Link} to={"/bakers/teams"} active={isActive(PATH_TEAMS)} />
          <NavLink label="Riders" component={Link} to={"/bakers/riders"} />
        </NavLink>
        <NavLink label="Log In" component={Link} to={"/login"} active={isActive(PATH_LOGIN)} />
        <NavLink label="Log Out" component={Link} to={"/logout"} />
      </AppShell.Navbar>

      <AppShell.Main>
        <ScrollRestoration />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
