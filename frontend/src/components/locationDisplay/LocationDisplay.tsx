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

  return (
    <div className={cx("flex gap-2 items-center", className)}>
      <HoverCard width={280} shadow="md" openDelay={300}>
        <HoverCard.Target>
          <div role={"button"} className={"underline cursor-pointer"}>
            {location}
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <div className={"flex gap-2 items-center text-xl"}>
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
              <FaRegCopy
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            </Button>
          </div>
        </HoverCard.Dropdown>
      </HoverCard>

      <Link to={`https://www.google.com/maps/place/${addressCoordinates}`} target="_blank">
        <FaMapMarkedAlt color={"lightGreen"} />
      </Link>
    </div>
  )
}
