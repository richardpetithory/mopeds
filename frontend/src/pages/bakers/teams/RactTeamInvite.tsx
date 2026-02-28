import {Loading} from "@/components/Loading.tsx"
import {RiderPickerInput} from "@/components/RiderPickerInput.tsx"
import {
  GQL_TEAM_RACE_MEMBERSHIP_INVITATION_MUTATION,
  GQL_TEAM_SUMMARY,
  type RaceTeamMembershipInvitationInput,
  type SaveTeamRaceMemberShipInvitationResponse,
} from "@/lib/gql/bakers/teams.ts"
import type {RaceTeam, RaceTeamMembership, Team} from "@/lib/models/bakers.ts"
import {NotFoundPage} from "@/pages/NotFoundPage.tsx"
import {gql} from "@apollo/client"
import {useMutation, useQuery} from "@apollo/client/react"
import {Alert, Button, Group, Select} from "@mantine/core"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {useNavigate, useParams} from "react-router"

export const GQL_DEPENDENCY_DATA = gql`
  query Races($teamId: String!) {
    team(id: $teamId) {
      id
    }
    teamRaces(teamId: $teamId) {
      race {
        id
        name
        year
      }
    }
    teamMembers(teamId: $teamId) {
      race {
        id
      }
      member {
        id
      }
    }
  }
`

export interface DependencyData {
  team: Team
  teamRaces: RaceTeam[]
  teamMembers: RaceTeamMembership[]
}

export const RaceTeamMembershipInvite = () => {
  const {teamId} = useParams()

  const {data: dependencyData, loading: loadingDependencyData} = useQuery<DependencyData>(GQL_DEPENDENCY_DATA, {
    fetchPolicy: "network-only",
    variables: {
      teamId: teamId || "",
    },
  })

  if (loadingDependencyData) return <Loading />

  if (!dependencyData?.team) return <NotFoundPage />

  if (!dependencyData) return null

  return <RaceTeamMembershipInviteForm teamId={dependencyData?.team.id} dependencyData={dependencyData} />
}

interface RaceTeamMembershipInviteFormProps {
  teamId: string
  dependencyData: DependencyData
}

const RaceTeamMembershipInviteForm = ({teamId, dependencyData}: RaceTeamMembershipInviteFormProps) => {
  const navigate = useNavigate()

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveTeamRaceMemberShipInvitationResponse>(
    GQL_TEAM_RACE_MEMBERSHIP_INVITATION_MUTATION
  )

  const {onSubmit, getInputProps, isDirty} = useForm<RaceTeamMembershipInvitationInput>({
    initialValues: {
      teamId: teamId,
      memberId: null,
      raceId: null,
    },
    validate: {
      memberId: (value) => (!value ? "You must select a Rider" : null),
      raceId: (value) => (!value ? "You must select a Race" : null),
    },
  })

  const handleSubmit = (data: RaceTeamMembershipInvitationInput) => {
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

        navigate(`/bakers/teams/${saveResponse?.data?.saveTeamRaceMembership?.raceTeamMembership.team.id}`)
      }
    })
  }

  const existingMembers = dependencyData?.teamMembers.map((teamMembership) => teamMembership.member.id) || []

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Group>
        <RiderPickerInput label={"Member"} {...getInputProps("memberId")} excludeIds={existingMembers} />
      </Group>
      <Group>
        <Select
          label={"Race"}
          data={(dependencyData?.teamRaces || []).map((teamRace) => {
            return {
              value: teamRace.race.id,
              label: teamRace.race.name,
            }
          })}
          {...getInputProps("raceId")}
        />
      </Group>
      <Group>
        <Button type={"submit"} disabled={awaitingMutation || !isDirty()}>
          Invite
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
