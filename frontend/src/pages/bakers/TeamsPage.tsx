import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import type {Team} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {Button, Center, Loader, Table} from "@mantine/core"
import {Link} from "react-router"

export interface TeamsResponse {
  teams: Team[]
}

export const GQL_TEAMS_LIST = gql`
  query Teams($offset: Int, $limit: Int) {
    teams(offset: $offset, limit: $limit) {
      id
      name
    }
  }
`

export const TeamsPage = () => {
  const {data} = useQuery<TeamsResponse>(GQL_TEAMS_LIST)

  if (!data)
    return (
      <Center>
        <Loader />
      </Center>
    )

  return (
    <>
      <PageHeader
        breadCrumbs={[{label: "Bakers", to: "/bakers"}, {label: "Teams"}]}
        staffActions={
          <Link to={`/bakers/teams/new`}>
            <Button>New</Button>
          </Link>
        }
      />

      <Table className="fit-content">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Team</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.teams.map((team) => (
            <Table.Tr key={team.id}>
              <Table.Td className="font-medium">
                <Link to={`/bakers/teams/${team.id}`}>{team.name}</Link>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}
