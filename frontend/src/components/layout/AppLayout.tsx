import {UserMenu} from "@/components/UserMenu.tsx"
import {useUserContext} from "@/lib/userContext/userContext.ts"
import {Avatar} from "@catalyst/avatar.tsx"
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@catalyst/dropdown.tsx"
import {Navbar, NavbarItem, NavbarSection, NavbarSpacer} from "@catalyst/navbar.tsx"
import {SidebarLayout} from "@catalyst/sidebar-layout.tsx"
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@catalyst/sidebar.tsx"
import {ChevronDownIcon, Cog8ToothIcon, PlusIcon} from "@heroicons/react/16/solid"
import {Toaster} from "react-hot-toast"
import {Outlet, ScrollRestoration, useLocation} from "react-router"

export const AppLayout = () => {
  const {currentUser} = useUserContext()

  const {pathname} = useLocation()

  return (
    <>
      <Toaster position="top-center" toastOptions={{duration: 8000}} />
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
            <NavbarSection>
              <Dropdown>
                <DropdownButton as={NavbarItem}>
                  <Avatar src="/users/erica.jpg" square />
                  Avatar
                </DropdownButton>
                <UserMenu user={currentUser} />
              </Dropdown>
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <Dropdown>
                <DropdownButton as={SidebarItem}>
                  {/*<Avatar src="/teams/catalyst.svg" />*/}
                  <SidebarLabel>{currentUser?.name}</SidebarLabel>
                  <ChevronDownIcon />
                </DropdownButton>
                <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                  <DropdownItem href="/settings">
                    <Cog8ToothIcon />
                    <DropdownLabel>Settings</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="#">
                    <Avatar slot="icon" src="/teams/catalyst.svg" />
                    <DropdownLabel>Catalyst</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem href="#">
                    <Avatar slot="icon" initials="BE" className="bg-purple-500 text-white" />
                    <DropdownLabel>Big Events</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="#">
                    <PlusIcon />
                    <DropdownLabel>New team&hellip;</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </SidebarHeader>

            <SidebarBody>
              <SidebarSection>
                <SidebarItem href="/bakers" current={pathname.startsWith("/bakers/races")}>
                  <SidebarLabel>Races</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/bakers/teams" current={pathname.startsWith("/bakers/teams")}>
                  <SidebarLabel>Teams</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarBody>

            <SidebarFooter className="max-lg:hidden">
              <UserMenu user={currentUser} />
            </SidebarFooter>
          </Sidebar>
        }
      >
        <ScrollRestoration />
        <Outlet />
      </SidebarLayout>
    </>
  )
}
