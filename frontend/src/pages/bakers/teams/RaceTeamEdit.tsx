import {Loading} from "@/components/Loading.tsx"
import {
  GQL_RACE_TEAM_MUTATION,
  GQL_TEAM_SUMMARY,
  type RaceTeamInput,
  type SaveRaceTeamResponse,
} from "@/lib/gql/bakers/teams.ts"
import type {Race, RaceTeam} from "@/lib/models/bakers.ts"
import {NotFoundPage} from "@/pages/NotFoundPage.tsx"
import {gql} from "@apollo/client"
import {useMutation, useQuery} from "@apollo/client/react"
import {Alert, Button, Group, Select} from "@mantine/core"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {useNavigate, useParams} from "react-router"

const GQL_DEPENDENCY_DATA = gql`
  query Races($teamId: String!) {
    races {
      id
      year
      name
    }
    teamRaces(teamId: $teamId) {
      race {
        id
      }
    }
  }
`

export interface DependencyData {
  races: Race[]
  teamRaces: RaceTeam[]
}

export const RaceTeamEdit = () => {
  const {teamId} = useParams()

  const {data: dependencyData, loading: loadingDependencyData} = useQuery<DependencyData>(GQL_DEPENDENCY_DATA, {
    fetchPolicy: "network-only",
    variables: {
      teamId: teamId,
    },
  })

  if (!teamId) return <NotFoundPage />

  if (loadingDependencyData) return <Loading />

  return <RaceTeamEditForm teamId={teamId} dependencyData={dependencyData!} />
}

interface RaceTeamEditFormProps {
  teamId: string
  dependencyData: DependencyData
}

const RaceTeamEditForm = ({teamId, dependencyData}: RaceTeamEditFormProps) => {
  const navigate = useNavigate()

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveRaceTeamResponse>(GQL_RACE_TEAM_MUTATION)

  const {onSubmit, getInputProps, isDirty} = useForm<RaceTeamInput>({
    initialValues: {
      teamId: teamId || null,
      raceId: null,
    },
  })

  const handleSubmit = (data: RaceTeamInput) => {
    doSave({
      variables: data,
      refetchQueries: [
        {
          query: GQL_TEAM_SUMMARY,
          variables: {
            teamId: teamId || "",
          },
        },
      ],
    }).then((saveResponse) => {
      if (saveResponse.data) {
        notifications.show({
          message: `Successfully ${teamId ? "updated" : "created"} team`,
        })
        navigate(`/bakers/teams/${saveResponse?.data?.saveTeamRace.teamRace.team.id}`)
      }
    })
  }

  const existingRaceIds = dependencyData?.teamRaces.map((teamRace) => teamRace.race.id)

  const availableRaces = dependencyData?.races.filter((race) => !existingRaceIds?.includes(race.id))

  return (
    <form onSubmit={onSubmit(handleSubmit)} className={"page-form"}>
      <Group>
        <Select
          label={"Race"}
          data={(availableRaces || []).map((race) => {
            return {
              value: race.id,
              label: race.name,
            }
          })}
          {...getInputProps("raceId")}
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
