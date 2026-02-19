import type {Race} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useMutation, useQuery} from "@apollo/client/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {Alert, Button, Group, TextInput} from "@mantine/core"
import {useEffect} from "react"
import {type SubmitHandler, useForm} from "react-hook-form"
import {useNavigate, useParams} from "react-router"
import * as yup from "yup"

const GQL_RACE = gql`
  query Race($raceId: String!) {
    race(id: $raceId) {
      id
      year
      name
    }
  }
`

interface RaceResponse {
  race: Race
}

const SAVE_RACE_MUTATION = gql`
  mutation SaveRace($id: String, $year: String!, $name: String!) {
    saveRace(id: $id, year: $year, name: $name) {
      race {
        id
        year
        name
      }
    }
  }
`

interface SaveRaceResponse {
  saveRace: {race: Race}
}

const schema = yup.object().shape({
  id: yup.string().required().nullable(),
  year: yup.string().required("Year is required"),
  name: yup.string().required("Name is required"),
})

export const RaceEdit = () => {
  const navigate = useNavigate()

  const {raceId} = useParams()

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveRaceResponse>(SAVE_RACE_MUTATION)

  const {data, loading: loadingRace} = useQuery<RaceResponse>(GQL_RACE, {
    variables: {
      raceId: raceId,
    },
    skip: !raceId,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<Race>({
    resolver: yupResolver(schema),
    defaultValues: {
      id: null,
      year: "",
      name: "",
    },
  })

  useEffect(() => {
    if (data?.race) {
      reset(data?.race)
    }
  }, [data, reset])

  const onSubmit: SubmitHandler<Race> = (data) => {
    doSave({variables: data}).then((saveResponse) => {
      if (saveResponse.data) {
        navigate(`/bakers/races/${saveResponse?.data?.saveRace.race.id}`)
      }
    })
  }

  if (loadingRace) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Group>
        <TextInput label={"Year"} {...register("year")} autoFocus={true} error={errors?.year?.message} />
      </Group>
      <Group>
        <TextInput label={"Name"} {...register("name")} error={errors?.name?.message} />
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
