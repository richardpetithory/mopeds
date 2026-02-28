import {useRiderContext} from "@/lib/userContext/riderContext.ts"
import {PATH_LOGIN, PATH_LOGOUT, PATH_PROFILE, PATH_RACES, PATH_REGISTER, PATH_RIDERS, PATH_TEAMS} from "@/routes.tsx"
import {AppShell, Divider, NavLink} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks"
import {isArray, some} from "lodash"
import {LuDonut, LuLogIn, LuLogOut} from "react-icons/lu"
import {Link, Outlet, ScrollRestoration, useLocation} from "react-router"

import logo from "@/assets/logo.png"
import {CurrentRiderName} from "@/components/CurrentRiderName.tsx"
import {NotFoundContext} from "@/lib/NotFoundContext.ts"
import {NotFoundPage} from "@/pages/NotFoundPage.tsx"
import {useContext, useEffect, useState} from "react"
import {BsFillPersonLinesFill} from "react-icons/bs"
import {MdOutlinePersonAddAlt1} from "react-icons/md"

export const Layout = () => {
  const {currentRider} = useRiderContext()
  const {notFound} = useContext(NotFoundContext)
  const {pathname} = useLocation()
  const [opened, {toggle}] = useDisclosure()
  const [showNotFound, setShowNotFound] = useState<boolean | null>(false)

  const isActive = (navPath: string | string[]) =>
    some(isArray(navPath) ? navPath : [navPath], (path) => {
      const matches = pathname.startsWith(path)
      if (isArray(navPath)) console.log(pathname, path, matches)
      return matches
    })

  useEffect(() => {
    setShowNotFound(notFound)
  }, [notFound])

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
          <NavLink label="Races" component={Link} to={PATH_RACES} active={isActive(PATH_RACES)} />
          <NavLink label="Teams" component={Link} to={PATH_TEAMS} active={isActive(PATH_TEAMS)} />
        </NavLink>
        <NavLink label="Riders" component={Link} to={"/riders"} active={isActive(PATH_RIDERS)} />
        <div className={"m-auto"} />
        <Divider />
        {!currentRider?.id && (
          <>
            <NavLink
              label={
                <div className={"flex items-center gap-1"}>
                  <span>Register</span>
                  <span className={"m-auto"} />
                  <MdOutlinePersonAddAlt1 />
                </div>
              }
              component={Link}
              to={PATH_REGISTER}
              active={isActive(PATH_REGISTER)}
            />
            <NavLink
              label={
                <div className={"flex items-center gap-1"}>
                  <span>Log In</span>
                  <span className={"m-auto"} />
                  <LuLogIn />
                </div>
              }
              component={Link}
              to={PATH_LOGIN}
              active={isActive(PATH_LOGIN)}
            />
          </>
        )}
        {currentRider?.id && (
          <>
            <NavLink
              label={
                <div className={"flex items-center gap-1"}>
                  <CurrentRiderName />
                  <span className={"m-auto"} />
                  <BsFillPersonLinesFill />
                </div>
              }
              component={Link}
              to={PATH_PROFILE}
              active={isActive(PATH_PROFILE)}
            />
            <NavLink
              label={
                <div className={"flex items-center gap-1"}>
                  <span>Log Out</span>
                  <span className={"m-auto"} />
                  <LuLogOut />
                </div>
              }
              component={Link}
              to={PATH_LOGOUT}
            />
          </>
        )}
        <div className={"mb-10"} />
      </AppShell.Navbar>

      <AppShell.Main>
        <ScrollRestoration />
        {showNotFound && <NotFoundPage />}
        {!showNotFound && <Outlet />}
      </AppShell.Main>
    </AppShell>
  )
}
