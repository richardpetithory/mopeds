import {Avatar} from "@/components/catalyst/avatar.tsx"
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/catalyst/dropdown.tsx"
import {Navbar, NavbarItem, NavbarSection, NavbarSpacer} from "@/components/catalyst/navbar.tsx"
import {SidebarLayout} from "@/components/catalyst/sidebar-layout.tsx"
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/components/catalyst/sidebar.tsx"
import {ApolloProvider} from "@apollo/client/react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  Cog8ToothIcon,
  HomeIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from "@heroicons/react/16/solid"
import {StrictMode} from "react"
import {createBrowserRouter, RouterProvider} from "react-router"
import {client} from "./lib/apiClient.ts"
import {UserContextProvider} from "./lib/userContext/UserContextProvider.tsx"
import LoginPage from "./pages/users/LoginPage.tsx"
import {UsersPage} from "./pages/users/UsersPage.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <UsersPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
])

export const App = () => {
  const pathname = window.location.pathname

  return (
    <StrictMode>
      <ApolloProvider client={client}>
        <UserContextProvider>
          <SidebarLayout
            navbar={
              <Navbar>
                <NavbarSpacer />
                <NavbarSection>
                  <Dropdown>
                    <DropdownButton as={NavbarItem}>
                      {/*<Avatar src="/users/erica.jpg" square />*/}
                      Avatar
                    </DropdownButton>
                    {/*<AccountDropdownMenu anchor="bottom end" />*/}
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
                      <SidebarLabel>Catalyst</SidebarLabel>
                      <ChevronDownIcon />
                    </DropdownButton>
                    <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                      <DropdownItem href="/settings">
                        <Cog8ToothIcon />
                        <DropdownLabel>Settings</DropdownLabel>
                      </DropdownItem>
                      <DropdownDivider />
                      <DropdownItem href="#">
                        {/*<Avatar slot="icon" src="/teams/catalyst.svg" />*/}
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
                    <SidebarItem href="/" current={pathname === "/"}>
                      <HomeIcon />
                      <SidebarLabel>Home</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/events" current={pathname.startsWith("/events")}>
                      <Square2StackIcon />
                      <SidebarLabel>Events</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/orders" current={pathname.startsWith("/orders")}>
                      <TicketIcon />
                      <SidebarLabel>Orders</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/settings" current={pathname.startsWith("/settings")}>
                      <Cog6ToothIcon />
                      <SidebarLabel>Settings</SidebarLabel>
                    </SidebarItem>
                  </SidebarSection>

                  <SidebarSection className="max-lg:hidden">
                    <SidebarHeading>Upcoming Events</SidebarHeading>
                    {/*{events.map((event) => (*/}
                    {/*  <SidebarItem key={event.id} href={event.url}>*/}
                    {/*    {event.name}*/}
                    {/*  </SidebarItem>*/}
                    {/*))}*/}
                  </SidebarSection>

                  <SidebarSpacer />

                  <SidebarSection>
                    <SidebarItem href="#">
                      <QuestionMarkCircleIcon />
                      <SidebarLabel>Support</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="#">
                      <SparklesIcon />
                      <SidebarLabel>Changelog</SidebarLabel>
                    </SidebarItem>
                  </SidebarSection>
                </SidebarBody>

                <SidebarFooter className="max-lg:hidden">
                  <Dropdown>
                    <DropdownButton as={SidebarItem}>
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="min-w-0">
                          <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                            Erica
                          </span>
                          <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                            erica@example.com
                          </span>
                        </span>
                      </span>
                      <ChevronUpIcon />
                    </DropdownButton>
                    {/*<AccountDropdownMenu anchor="top start" />*/}
                  </Dropdown>
                </SidebarFooter>
              </Sidebar>
            }
          >
            <RouterProvider router={router} />
          </SidebarLayout>
        </UserContextProvider>
      </ApolloProvider>
    </StrictMode>
  )
}
