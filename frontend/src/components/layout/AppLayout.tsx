import {AppShell, Burger, NavLink} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks"
import {LuDonut} from "react-icons/lu"

import {Link, Outlet, ScrollRestoration} from "react-router"

export const AppLayout = () => {
  const [opened, {toggle}] = useDisclosure()

  return (
    <AppShell
      padding="md"
      header={{height: 60}}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: {mobile: !opened},
      }}
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavLink label="Bakers" leftSection={<LuDonut />} childrenOffset={28}>
          <NavLink label="Races" component={Link} to={"/bakers/races"} />
          <NavLink label="Teams" component={Link} to={"/bakers/teams"} />
          <NavLink label="Riders" component={Link} to={"/bakers/riders"} />
        </NavLink>
      </AppShell.Navbar>

      <AppShell.Main>
        <ScrollRestoration />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
