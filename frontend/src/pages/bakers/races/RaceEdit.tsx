import {Loading} from "@/components/Loading.tsx"
import {
  GQL_RACE,
  GQL_RACE_MUTATION_SAVE,
  GQL_RACES,
  type RaceResponse,
  type SaveRaceInput,
  type SaveRaceResponse,
} from "@/lib/gql/bakers/races.ts"
import {useMutation, useQuery} from "@apollo/client/react"
import {Alert, Button, Group, Textarea, TextInput} from "@mantine/core"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {format} from "date-fns"
import {useEffect} from "react"
import {useNavigate, useParams} from "react-router"

export const RaceEdit = () => {
  const navigate = useNavigate()

  const {raceId} = useParams()

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveRaceResponse>(GQL_RACE_MUTATION_SAVE)

  const {data, loading: loadingRace} = useQuery<RaceResponse>(GQL_RACE, {
    variables: {
      id: raceId,
    },
    skip: !raceId,
  })

  const {setValues, onSubmit, getInputProps} = useForm<SaveRaceInput>({
    initialValues: {
      id: null,
      year: Number(format(new Date(), "yyyy")),
      name: "",
      description: "",
    },
    validate: {
      year: (value) => {
        if (value < 1000) return "Year must be 4 characters long"
        if (isNaN(Number(value))) return "Year must be a number"
      },
      name: (value) => (value.trim().length < 1 ? "Name cannot be empty" : null),
    },
  })

  useEffect(() => {
    if (data?.race) {
      setValues(data?.race)
    }
  }, [data, setValues])

  const handleSubmit = (data: SaveRaceInput) => {
    doSave({variables: data, refetchQueries: [GQL_RACES]}).then((saveResponse) => {
      if (saveResponse.data) {
        notifications.show({
          message: `Race ${raceId ? "updated" : "created"}`,
        })

        navigate(`/bakers/races/${saveResponse?.data?.saveRace.race.id}`)
      }
    })
  }

  if (loadingRace) return <Loading />

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
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
