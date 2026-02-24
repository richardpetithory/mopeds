import {Loading} from "@/components/Loading.tsx"
import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import {GQL_TEAMS, type TeamsResponse} from "@/lib/gql/bakers/teams.ts"
import {useQuery} from "@apollo/client/react"
import {Button, Table} from "@mantine/core"
import {Link} from "react-router"

export const TeamsPage = () => {
  const {data} = useQuery<TeamsResponse>(GQL_TEAMS)

  if (!data) return <Loading />

  return (
    <>
      <PageHeader
        breadCrumbs={[{label: "Bakers", to: "/bakers"}, {label: "Teams"}]}
        staffActions={
          <Link to={`/bakers/teams/new`}>
            <Button color={"green"}>New</Button>
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
