import {GQL_RIDER, GQL_RIDERS, type RiderResponse, type RidersResponse} from "@/lib/gql/users.ts"
import type {Rider} from "@/lib/models/users.ts"
import {useLazyQuery} from "@apollo/client/react"
import {Button, Combobox, InputWrapper, useCombobox} from "@mantine/core"
import {useDebouncedCallback, useUncontrolled} from "@mantine/hooks"
import {type ComponentPropsWithoutRef, type ReactNode, useEffect, useState} from "react"

interface RiderPickerInputProps extends Omit<ComponentPropsWithoutRef<"input">, "onChange" | "size"> {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onRiderChange?: (rider: Rider | null) => void
  label?: string
  error?: ReactNode
  excludeIds?: string[] | null
}

export const RiderPickerInput = ({
  value,
  defaultValue,
  onChange,
  error,
  onRiderChange,
  label,
  excludeIds = null,
  ...rest
}: RiderPickerInputProps) => {
  const [_value, setValue] = useUncontrolled({
    value: value,
    defaultValue,
    finalValue: "",
    onChange,
  })

  const [search, setSearch] = useState("")
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null)
  const [riders, setRiders] = useState<Rider[]>([])
  const [loadRider] = useLazyQuery<RiderResponse>(GQL_RIDER)
  const [findRiders] = useLazyQuery<RidersResponse>(GQL_RIDERS)

  useEffect(() => {
    if (_value) {
      loadRider({
        variables: {
          id: _value,
        },
      })
        .then((response) => {
          setSelectedRider(response.data?.rider || null)
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
        })
    }

    findRiders({
      variables: {
        nameSearch: "",
        excludeIds,
      },
    }).then((response) => {
      setRiders(response.data?.riders || [])
    })
  }, [_value, excludeIds, findRiders, loadRider])

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
      combobox.focusTarget()
      setSearch("")
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput()
    },
  })

  const handleSearch = useDebouncedCallback(async (query: string) => {
    if (query.trim().length === 0) {
      setRiders([])
      return
    }

    findRiders({
      variables: {
        nameSearch: query,
        excludeIds,
      },
    })
      .then((response) => {
        const foundRiders = response.data
        setRiders(foundRiders?.riders || [])
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })
  }, 500)

  const options = riders
    .filter((rider) => rider.name.toLowerCase().includes(search.toLowerCase().trim()))
    .map((rider) => (
      <>
        {rider.id && (
          <Combobox.Option value={rider.id.toString()} key={rider.id}>
            {rider.name}
          </Combobox.Option>
        )}
      </>
    ))

  return (
    <InputWrapper label={label} error={error}>
      <Combobox
        {...rest}
        store={combobox}
        width={250}
        position="bottom-start"
        withArrow
        onOptionSubmit={(riderId) => {
          const rider = riders.find((r) => r.id === riderId) || null
          setSelectedRider(rider)
          setValue(riderId)
          if (onRiderChange) onRiderChange(rider)
          combobox.closeDropdown()
        }}
      >
        <Combobox.Target withAriaAttributes={false}>
          <div>
            <Button onClick={() => combobox.toggleDropdown()} variant="outline">
              {selectedRider ? `Rider: ${selectedRider.name}` : "Pick Rider"}
            </Button>
          </div>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Search
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value)
              handleSearch(event.currentTarget.value)
            }}
            placeholder="Search Riders..."
          />
          <Combobox.Options>
            {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </InputWrapper>
  )
}
