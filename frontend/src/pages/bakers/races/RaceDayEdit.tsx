import {Loading} from "@/components/Loading.tsx"
import {
  GQL_RACE_DAY_MUTATION_SAVE,
  GQL_RACE_SUMMARY,
  type SaveRaceDayInput,
  type SaveRaceDayResponse,
} from "@/lib/gql/bakers/races.ts"
import type {RaceDay} from "@/lib/models/bakers.ts"
import {gql} from "@apollo/client"
import {useMutation, useQuery} from "@apollo/client/react"
import {Alert, Button, Group, Switch, Textarea, TextInput} from "@mantine/core"
import {DateTimePicker} from "@mantine/dates"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {set} from "date-fns"
import {useEffect} from "react"
import {useNavigate, useParams} from "react-router"

const GQL_DEPENDENCY_DATA = gql`
  query RaceDays($raceDayId: String!) {
    raceDay(id: $raceDayId) {
      id
      previousDay {
        id
        finishingAddress
        finishingAddressCoordinates
        finishingLocation
      }
      dayNumber
      description
      dayOff
      startingIsPreviousFinish
      startingAddress
      startingAddressCoordinates
      startingLocation
      finishingAddress
      finishingAddressCoordinates
      finishingLocation
    }
  }
`

export interface DependencyData {
  raceDay: RaceDay
}

export const RaceDayEdit = () => {
  const navigate = useNavigate()

  const {raceId, dayId} = useParams()

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveRaceDayResponse>(GQL_RACE_DAY_MUTATION_SAVE)

  const {data: dependencyData, loading: loadingDependencyData} = useQuery<DependencyData>(GQL_DEPENDENCY_DATA, {
    fetchPolicy: "network-only",
    variables: {
      raceDayId: dayId || "",
      raceId: raceId,
    },
  })

  const {setValues, onSubmit, getInputProps, values} = useForm<SaveRaceDayInput>({
    initialValues: {
      raceId: raceId || "",
      dayId: "",
      dayNumber: null,
      description: "",
      dayOff: false,
      startingDatetime: set(new Date(), {
        hours: 10,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      startingIsPreviousFinish: true,
      startingAddress: "",
      startingAddressCoordinates: "",
      startingLocation: "",

      finishingAddress: "",
      finishingAddressCoordinates: "",
      finishingLocation: "",

      commentary: "",
    },
    validate: {},
  })

  useEffect(() => {
    if (dependencyData?.raceDay) {
      setValues(dependencyData?.raceDay)
    }
  }, [dependencyData, raceId, setValues])

  const handleSubmit = (data: SaveRaceDayInput) => {
    doSave({
      variables: data,
      refetchQueries: [
        {
          query: GQL_RACE_SUMMARY,
          variables: {
            id: raceId,
          },
        },
      ],
    }).then((saveResponse) => {
      if (saveResponse.data) {
        notifications.show({
          message: `Race day ${saveResponse.data.saveRaceDay.raceDay.dayNumber} added`,
        })

        navigate(`/bakers/races/${raceId}`)
      }
    })
  }

  if (loadingDependencyData) return <Loading />

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Group>
        <TextInput label={"Day #"} {...getInputProps("dayNumber")} disabled={true} placeholder={"Auto-generated"} />
      </Group>
      <Group>
        <Switch label={"Day off!"} {...getInputProps("dayOff", {type: "checkbox"})} />
      </Group>
      {!values.dayOff && (
        <>
          <Group>
            <DateTimePicker label={"Starting Date & Time"} {...getInputProps("startingDatetime")} />
          </Group>

          <Group>
            <Switch
              label={"Starting location is the same as previous day finish line"}
              {...getInputProps("startingIsPreviousFinish", {type: "checkbox"})}
            />
          </Group>
          {!values.startingIsPreviousFinish && (
            <>
              <Group>
                <Textarea
                  label={"Starting Address"}
                  {...getInputProps("startingAddress")}
                  rows={3}
                  className={"w-100"}
                />
              </Group>
              <Group>
                <TextInput
                  label={"Starting Address Coordinates"}
                  {...getInputProps("startingAddressCoordinates")}
                  className={"w-100"}
                />
              </Group>
              <Group className={"pb-0"}>
                <TextInput
                  label={"Starting Location"}
                  {...getInputProps("startingLocation")}
                  className={"w-100"}
                  description={"Short display name of the address"}
                />
              </Group>
            </>
          )}

          <Group>
            <Textarea label={"Finishing Address"} {...getInputProps("finishingAddress")} rows={3} className={"w-100"} />
          </Group>
          <Group>
            <TextInput
              label={"Finishing Address Coordinates"}
              {...getInputProps("finishingAddressCoordinates")}
              className={"w-100"}
            />
          </Group>
          <Group>
            <TextInput
              label={"Finishing Location"}
              {...getInputProps("finishingLocation")}
              className={"w-100"}
              description={"Short display name of the address"}
            />
          </Group>
        </>
      )}

      <Group>
        <Textarea
          label={"Description"}
          placeholder={"A description of what people should expect for that day"}
          {...getInputProps("description")}
          rows={10}
          className={"w-100"}
        />
      </Group>
      <Group>
        <Textarea
          label={"Day Summary"}
          placeholder={"A summary of how the race went that day"}
          {...getInputProps("commentary")}
          rows={10}
          className={"w-100"}
        />
      </Group>

      <Group>
        <Button type={"submit"} disabled={awaitingMutation}>
          Save
        </Button>
      </Group>

      {error && (
        <Alert variant={"filled"} color={"red"} className={"fit-content"}>
          {error.message}
        </Alert>
      )}
    </form>
  )
}
