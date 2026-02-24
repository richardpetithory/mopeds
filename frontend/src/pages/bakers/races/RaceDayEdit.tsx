import {Loading} from "@/components/Loading.tsx"
import {
  GQL_RACE_DAY,
  GQL_RACE_DAY_MUTATION_SAVE,
  type RaceDayResponse,
  type SaveRaceDayInput,
  type SaveRaceDayResponse,
} from "@/lib/gql/bakers/races.ts"
import {GQL_TEAM_SUMMARY} from "@/lib/gql/bakers/teams.ts"
import {useMutation, useQuery} from "@apollo/client/react"
import {Alert, Button, Group, Textarea, TextInput} from "@mantine/core"
import {DateTimePicker} from "@mantine/dates"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {set} from "date-fns"
import {useEffect} from "react"
import {useNavigate, useParams} from "react-router"

export const RaceDayEdit = () => {
  const navigate = useNavigate()

  const {raceId, dayId} = useParams()

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveRaceDayResponse>(GQL_RACE_DAY_MUTATION_SAVE)

  const {data, loading: loadingRace} = useQuery<RaceDayResponse>(GQL_RACE_DAY, {
    variables: {
      id: dayId,
    },
    skip: !dayId,
  })

  const {setValues, onSubmit, getInputProps} = useForm<SaveRaceDayInput>({
    initialValues: {
      raceId: raceId || "",
      dayId: "",
      dayNumber: null,
      description: "",
      startingDatetime: set(new Date(), {
        hours: 10,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),

      startingAddress: "Pee Pee Island, Newfoundland and Labrador, Canada",
      startingAddressCoordinates: "47.191657,-52.837253",
      startingLocation: "Pee Pee Island",

      finishingAddress: "Poo Poo Point, Washington, USA",
      finishingAddressCoordinates: "47.499489,-122.008570",
      finishingLocation: "Poo Poo Point",

      commentary: "",
    },
    validate: {},
  })

  useEffect(() => {
    if (data?.raceDay) {
      setValues(data?.raceDay)
    }
  }, [data, raceId, setValues])

  const handleSubmit = (data: SaveRaceDayInput) => {
    doSave({variables: data, refetchQueries: [GQL_TEAM_SUMMARY]}).then((saveResponse) => {
      if (saveResponse.data) {
        notifications.show({
          message: `Race day ${saveResponse.data.saveRaceDay.raceDay.dayNumber} added`,
        })

        navigate(`/bakers/races/${raceId}/${saveResponse.data.saveRaceDay.raceDay.id}`)
      }
    })
  }

  if (loadingRace) return <Loading />

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Group>
        <TextInput label={"Day #"} {...getInputProps("dayNumber")} disabled={true} placeholder={"Auto-generated"} />
      </Group>
      <Group>
        <DateTimePicker label={"Starting Date & Time"} {...getInputProps("startingDatetime")} />
      </Group>
      <Group>
        <Textarea label={"Starting Address"} {...getInputProps("startingAddress")} rows={3} className={"w-100"} />
      </Group>
      <Group>
        <TextInput
          label={"Starting Address Coordinates"}
          {...getInputProps("startingAddressCoordinates")}
          className={"w-100"}
        />
      </Group>
      <Group>
        <TextInput
          label={"Starting Location"}
          {...getInputProps("startingLocation")}
          className={"w-100"}
          description={"Short display name of the address"}
        />
      </Group>

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
