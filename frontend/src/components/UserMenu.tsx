import {type CurrentUserInfo} from "@/lib/userContext/userContext.ts"
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@catalyst/dropdown.tsx"
import {SidebarItem} from "@catalyst/sidebar.tsx"
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid"

interface UserMenuProps {
  user: CurrentUserInfo | null
  anchor?: "bottom end" | "top start"
}

export const UserMenu = ({user, anchor = "bottom end"}: UserMenuProps) => {
  if (!user) {
    return null
  }

  return (
    <Dropdown>
      <DropdownButton as={SidebarItem}>
        <span className="flex min-w-0 items-center gap-3">
          <span className="min-w-0">
            <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">{user.name}</span>
            <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">{user.email}</span>
          </span>
        </span>
        <ChevronUpIcon />
      </DropdownButton>
      <DropdownMenu className="min-w-64" anchor={anchor}>
        <DropdownItem href="#">
          <UserCircleIcon />
          <DropdownLabel>My account</DropdownLabel>
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem href="#">
          <ShieldCheckIcon />
          <DropdownLabel>Privacy policy</DropdownLabel>
        </DropdownItem>
        <DropdownItem href="#">
          <LightBulbIcon />
          <DropdownLabel>Share feedback</DropdownLabel>
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem href="/logout">
          <ArrowRightStartOnRectangleIcon />
          <DropdownLabel>Sign out</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
