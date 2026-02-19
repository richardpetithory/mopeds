import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import type {RaceTeam, Team} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {Button, Center, Loader, Table} from "@mantine/core"
import {Link, useParams} from "react-router"

export interface TeamResponse {
  team: Team
  teamRaces: RaceTeam[]
}

export const GQL_TEAM_SUMMARY = gql`
  query Team($id: String!) {
    team(id: $id) {
      id
      name
    }
    teamRaces(teamId: $id) {
      team {
        name
      }
      race {
        id
        year
        name
      }
    }
  }
`

export const TeamPage = () => {
  const {teamId} = useParams()

  const {data} = useQuery<TeamResponse>(GQL_TEAM_SUMMARY, {
    variables: {id: teamId},
  })

  if (!data)
    return (
      <Center>
        <Loader />
      </Center>
    )

  return (
    <>
      <PageHeader
        breadCrumbs={[{label: "Teams", to: "/teams"}, {label: data.team.name}]}
        staffActions={
          <Link to={`/teams/${data.team.id}/edit`}>
            <Button>Edit</Button>
          </Link>
        }
      />

      <Table className="fit-content">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Race</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.teamRaces.map((teamRace) => (
            <Table.Tr key={teamRace.race.id}>
              <Table.Td className="font-medium">
                <Link to={`/bakers/races/${teamRace.race.id}`}>
                  {teamRace.race.year} - {teamRace.race.name}
                </Link>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}
