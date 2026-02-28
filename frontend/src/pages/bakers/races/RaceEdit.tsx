import {Loading} from "@/components/Loading.tsx"
import {GQL_RACE, GQL_RACES, type RaceResponse} from "@/lib/gql/bakers/races.ts"
import type {Race} from "@/lib/models/bakers.ts"
import {gql} from "@apollo/client"
import {useMutation, useQuery} from "@apollo/client/react"
import {Alert, Button, Group, Textarea, TextInput} from "@mantine/core"
import {DateTimePicker} from "@mantine/dates"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {set} from "date-fns"
import {useNavigate, useParams} from "react-router"

interface SaveRaceInput {
  id: string | null
  year: string
  name: string
  description?: string
  meetupDatetime: Date
  meetupAddress: string
  meetupAddressCoordinates: string
  meetupLocation: string
  meetupDescription: string
}

const GQL_RACE_MUTATION_SAVE = gql`
  mutation SaveRace(
    $id: String
    $year: String!
    $name: String!
    $description: String
    $meetupDatetime: DateTime
    $meetupAddress: String
    $meetupAddressCoordinates: String
    $meetupLocation: String
    $meetupDescription: String
  ) {
    saveRace(
      id: $id
      year: $year
      name: $name
      description: $description
      meetupDatetime: $meetupDatetime
      meetupAddress: $meetupAddress
      meetupAddressCoordinates: $meetupAddressCoordinates
      meetupLocation: $meetupLocation
      meetupDescription: $meetupDescription
    ) {
      race {
        id
        year
        name
        description
        meetupDatetime
        meetupAddress
        meetupAddressCoordinates
        meetupLocation
        meetupDescription
      }
    }
  }
`

interface SaveRaceResponse {
  saveRace: {race: Race}
}

export const RaceEdit = () => {
  const {raceId} = useParams()

  const {data, loading: loadingRace} = useQuery<RaceResponse>(GQL_RACE, {
    variables: {
      id: raceId,
    },
    skip: !raceId,
  })

  if (loadingRace) return <Loading />

  return <RaceEditForm race={data?.race} />
}

const RaceEditForm = ({race}: {race: Race | undefined}) => {
  const navigate = useNavigate()

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveRaceResponse>(GQL_RACE_MUTATION_SAVE)

  const {onSubmit, getInputProps, isDirty} = useForm<SaveRaceInput>({
    initialValues: race
      ? {...race}
      : {
          id: null,
          year: new Date().getFullYear().toString(),
          name: "",
          description: "",
          meetupDatetime: set(new Date(), {
            hours: 10,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
          }),
          meetupAddress: "",
          meetupAddressCoordinates: "",
          meetupLocation: "",
          meetupDescription: "",
        },
    validate: {
      year: (value) => {
        if (isNaN(Number(value))) return "Year must be a number"
        if (parseInt(value) < 1000) return "Year must be 4 characters long"
      },
      name: (value) => (value.trim().length < 1 ? "Name cannot be empty" : null),
    },
  })

  const handleSubmit = (data: SaveRaceInput) => {
    doSave({variables: data, refetchQueries: [GQL_RACES]}).then((saveResponse) => {
      if (saveResponse.data) {
        notifications.show({
          message: `Race ${data.id ? "updated" : "created"}`,
        })

        navigate(`/bakers/races/${saveResponse?.data?.saveRace.race.id}`)
      }
    })
  }

  return (
    <form onSubmit={onSubmit(handleSubmit)} className={"page-form"}>
      <Group>
        <TextInput label={"Year"} {...getInputProps("year")} autoFocus={true} className={"w-100"} />
      </Group>
      <Group>
        <TextInput label={"Name"} {...getInputProps("name")} className={"w-100"} />
      </Group>
      <Group>
        <Textarea label={"Description"} {...getInputProps("description")} rows={10} className={"w-100"} />
      </Group>
      <Group>
        <DateTimePicker
          label={"Meetup Date & Time"}
          {...getInputProps("meetupDatetime")}
          valueFormat="MMM DD, YYYY @ hh:mm A"
          timePickerProps={{format: "12h"}}
        />
      </Group>
      <Group>
        <Textarea
          label={"Meetup Address"}
          {...getInputProps("meetupAddress")}
          rows={4}
          className={"w-100"}
          description={"Full address. Use a new line for each part of the address (street, city+state, zip)"}
        />
      </Group>
      <Group>
        <TextInput
          label={"Meetup Address Coordinates"}
          {...getInputProps("meetupAddressCoordinates")}
          className={"w-100"}
        />
      </Group>
      <Group className={"pb-0"}>
        <TextInput
          label={"Meetup Location"}
          {...getInputProps("meetupLocation")}
          className={"w-100"}
          description={"Just the city and state"}
        />
      </Group>
      <Group>
        <Textarea
          label={"Meetup Description"}
          {...getInputProps("meetupDescription")}
          rows={10}
          className={"w-100"}
          description={"Description of the meetup location, parking, etc."}
        />
      </Group>
      <Group>
        <Button type={"submit"} disabled={awaitingMutation || !isDirty()}>
          Save
        </Button>
      </Group>
      {error?.message && error?.message !== "NONE" && (
        <Alert variant={"filled"} color={"red"} className={"fit-content"}>
          {error.message}
        </Alert>
      )}
    </form>
  )
}
