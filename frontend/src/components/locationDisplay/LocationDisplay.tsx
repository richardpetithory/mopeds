import type {PropsWithClassName} from "@/lib/types.ts"
import {Button, HoverCard} from "@mantine/core"
import {useClipboard} from "@mantine/hooks"
import {notifications} from "@mantine/notifications"
import cx from "clsx"
import {FaMapMarkedAlt, FaRegCopy} from "react-icons/fa"
import {Link} from "react-router"

interface LocationDisplayProps extends PropsWithClassName {
  address: string
  addressCoordinates: string
  location: string
}

export const LocationDisplay = ({address, addressCoordinates, location, className}: LocationDisplayProps) => {
  const clipboard = useClipboard({timeout: 500})

  const display = (
    <div
      {...(address ? {role: "button"} : {})}
      className={cx("underline cursor-pointer text-nowrap", {
        "rainbow-text": (location || "").toLowerCase().includes("gay"),
      })}
    >
      {location}
    </div>
  )

  if (!address) return display

  return (
    <div className={cx("flex gap-2 items-center", className)}>
      <HoverCard shadow="md" openDelay={300}>
        <HoverCard.Target>{display}</HoverCard.Target>
        <HoverCard.Dropdown>
          <div className={"flex gap-2 items-center"}>
            <div className={"whitespace-pre"}>{address}</div>
            <div className={"m-auto"} />
            <Button
              variant={"transparent"}
              onClick={() => {
                clipboard.copy(address)

                notifications.show({
                  message: `Copied address to clipboard`,
                })
              }}
            >
              <FaRegCopy size={20} />
            </Button>
          </div>
        </HoverCard.Dropdown>
      </HoverCard>

      {addressCoordinates && (
        <Link to={`https://www.google.com/maps/place/${addressCoordinates}`} target="_blank">
          <FaMapMarkedAlt color={"lightGreen"} />
        </Link>
      )}
    </div>
  )
}
