import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import type {Race} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {Button, Center, Loader, Table} from "@mantine/core"
import {Link} from "react-router"

export interface RacesResponse {
  races: Race[]
}

export const GQL_RACES_LIST = gql`
  query Races($offset: Int, $limit: Int) {
    races(offset: $offset, limit: $limit) {
      id
      year
      name
    }
  }
`

export const RacesPage = () => {
  const {data} = useQuery<RacesResponse>(GQL_RACES_LIST)

  if (!data)
    return (
      <Center>
        <Loader />
      </Center>
    )

  return (
    <>
      <PageHeader
        breadCrumbs={[{label: "Bakers"}]}
        staffActions={
          <Link to={`/bakers/races/new`}>
            <Button>New</Button>
          </Link>
        }
      />

      <Table className="fit-content">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Year</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.races.map((race) => (
            <Table.Tr key={race.id}>
              <Table.Td className="font-medium">
                <Link to={`${race.id}`}>{race.name}</Link>
              </Table.Td>
              <Table.Td>{race.year}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}
