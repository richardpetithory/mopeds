// import {Button, Menu} from "@mantine/core"
// import {useLocation} from "react-router"
// import Dropdown = Menu.Dropdown
//
// interface UserMenuProps {
//   user: Rider | null
//   anchor?: "bottom end" | "top start"
// }
//
// export const UserMenu = ({user, anchor = "bottom end"}: UserMenuProps) => {
//   const {pathname} = useLocation()
//
//   if (!user) {
//     if (pathname !== "/login") {
//       return <Button href={"/login"}>Log In</Button>
//     } else return null
//   }
//
//   return (
//     <Dropdown>
//       <DropdownButton as={SidebarItem}>
//         <span className="flex min-w-0 items-center gap-3">
//           <span className="min-w-0">
//             <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">{user.name}</span>
//             <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">{user.email}</span>
//           </span>
//         </span>
//         <ChevronUpIcon />
//       </DropdownButton>
//       <DropdownMenu className="min-w-64" anchor={anchor}>
//         <DropdownItem href="#">
//           <UserCircleIcon />
//           <DropdownLabel>My account</DropdownLabel>
//         </DropdownItem>
//         <DropdownDivider />
//         <DropdownItem href="#">
//           <ShieldCheckIcon />
//           <DropdownLabel>Privacy policy</DropdownLabel>
//         </DropdownItem>
//         <DropdownItem href="#">
//           <LightBulbIcon />
//           <DropdownLabel>Share feedback</DropdownLabel>
//         </DropdownItem>
//         <DropdownDivider />
//         <DropdownItem href="/logout">
//           <ArrowRightStartOnRectangleIcon />
//           <DropdownLabel>Sign out</DropdownLabel>
//         </DropdownItem>
//       </DropdownMenu>
//     </Dropdown>
//   )
// }
