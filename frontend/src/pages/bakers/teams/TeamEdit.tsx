import {Loading} from "@/components/Loading.tsx"
import {RiderPickerInput} from "@/components/RiderPickerInput.tsx"
import {
  GQL_TEAM,
  GQL_TEAM_MUTATION,
  GQL_TEAMS,
  type SaveTeamInput,
  type SaveTeamResponse,
  type TeamResponse,
} from "@/lib/gql/bakers/teams.ts"
import {useMutation, useQuery} from "@apollo/client/react"
import {Alert, Button, Group, Textarea, TextInput} from "@mantine/core"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {useEffect} from "react"
import {useNavigate, useParams} from "react-router"

export const TeamEdit = () => {
  const navigate = useNavigate()

  const {teamId} = useParams()

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveTeamResponse>(GQL_TEAM_MUTATION)

  const {data, loading: loadingTeam} = useQuery<TeamResponse>(GQL_TEAM, {
    variables: {
      id: teamId,
    },
    skip: !teamId,
  })

  const {setValues, onSubmit, getInputProps} = useForm<SaveTeamInput>({
    initialValues: {
      id: null,
      name: "",
      description: "",
      managerId: null,
    },
  })

  useEffect(() => {
    if (data?.team) {
      setValues({...data?.team, managerId: data.team.manager.id})
    }
  }, [data?.team, setValues])

  const handleSubmit = (data: SaveTeamInput) => {
    doSave({variables: data, refetchQueries: [GQL_TEAMS]}).then((saveResponse) => {
      if (saveResponse.data) {
        notifications.show({
          message: `Successfully ${teamId ? "updated" : "created"} team`,
        })

        navigate(`/bakers/teams/${saveResponse?.data?.saveTeam.team.id}`)
      }
    })
  }

  if (loadingTeam) return <Loading />

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Group>
        <TextInput label={"Name"} {...getInputProps("name")} autoFocus={true} />
      </Group>
      <Group>
        <RiderPickerInput label={"Manager"} {...getInputProps("managerId")} />
      </Group>
      <Group>
        <Textarea label={"Description"} {...getInputProps("description")} />
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
