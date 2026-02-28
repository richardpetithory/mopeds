import {Loading} from "@/components/Loading.tsx"
import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import {RiderPickerInput} from "@/components/RiderPickerInput.tsx"
import {
  GQL_TEAM,
  GQL_TEAM_MUTATION,
  GQL_TEAMS,
  type SaveTeamInput,
  type SaveTeamResponse,
  type TeamResponse,
} from "@/lib/gql/bakers/teams.ts"
import type {Team} from "@/lib/models/bakers.ts"
import {useRiderContext} from "@/lib/userContext/riderContext.ts"
import {useMutation, useQuery} from "@apollo/client/react"
import {Alert, Button, FileInput, Group, Textarea, TextInput} from "@mantine/core"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {omit} from "lodash"
import {Link, useNavigate, useParams} from "react-router"

export const TeamEdit = () => {
  const {teamId} = useParams()

  const {data, loading: loadingTeam} = useQuery<TeamResponse>(GQL_TEAM, {
    variables: {
      id: teamId,
    },
    skip: !teamId,
  })

  if (loadingTeam) return <Loading />

  if (!data?.team) return null

  return <TeamEditForm team={data?.team} />
}

const TeamEditForm = ({team}: {team: Team}) => {
  const navigate = useNavigate()
  const {currentRider} = useRiderContext()

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveTeamResponse>(GQL_TEAM_MUTATION)

  const {onSubmit, getInputProps, isDirty, values} = useForm<SaveTeamInput>({
    initialValues: team
      ? {
          ...omit(team, "manager"),
          managerId: team.manager.id,
        }
      : {
          id: null,
          name: "",
          description: "",
          managerId: currentRider?.id || null,
          logo: null,
        },
  })

  const handleSubmit = (data: SaveTeamInput) => {
    doSave({variables: data, refetchQueries: [GQL_TEAMS]}).then((saveResponse) => {
      if (saveResponse.data) {
        notifications.show({
          message: `Successfully ${data.id ? "updated" : "created"} team`,
        })

        navigate(`/bakers/teams/${saveResponse?.data?.saveTeam.team.id}`)
      }
    })
  }

  return (
    <div className={"flex flex-col gap-8"}>
      <PageHeader
        breadCrumbs={[{label: "Bakers", to: "/bakers"}, {label: "Teams", to: "/bakers/teams"}, {label: team.name}]}
        staffActions={
          <>
            {(currentRider?.id === team?.manager?.id || currentRider?.isStaff) && (
              <>
                <Link to={`/bakers/teams/${team.id}/invite`}>
                  <Button color={"green"}>Invite Member to Race</Button>
                </Link>

                <Link to={`/bakers/teams/${team.id}/joinRace`}>
                  <Button>Join Race</Button>
                </Link>

                <Link to={`/bakers/teams/${team.id}/edit`}>
                  <Button>Edit</Button>
                </Link>
              </>
            )}
          </>
        }
      />

      <form onSubmit={onSubmit(handleSubmit)} className={"page-form"}>
        <Group>
          <TextInput label={"Name"} {...getInputProps("name")} autoFocus={true} />
        </Group>
        <Group>
          <RiderPickerInput label={"Manager"} {...getInputProps("managerId")} />
        </Group>
        <Group>
          <Textarea label={"Description"} {...getInputProps("description")} />
        </Group>
        <Group className={"flex items-end gap-4 "}>
          <FileInput
            clearable
            variant="filled"
            accept="image/png,image/jpeg"
            placeholder={values.logo ? "Change team logo" : "Upload team logo"}
            {...getInputProps("logo")}
            className={"w-50"}
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
    </div>
  )
}
