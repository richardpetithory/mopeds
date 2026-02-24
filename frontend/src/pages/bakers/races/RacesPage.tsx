import {Loading} from "@/components/Loading.tsx"
import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import {GQL_RACES, type RacesResponse} from "@/lib/gql/bakers/races.ts"
import {useQuery} from "@apollo/client/react"
import {Button, Table} from "@mantine/core"
import {Link} from "react-router"

export const RacesPage = () => {
  const {data} = useQuery<RacesResponse>(GQL_RACES)

  if (!data) return <Loading />

  return (
    <>
      <PageHeader
        breadCrumbs={[{label: "Bakers"}]}
        staffActions={
          <Link to={`/bakers/races/new`}>
            <Button color={"green"}>New</Button>
          </Link>
        }
      />

      <Table className="fit-content">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Year</Table.Th>
            <Table.Th>Description</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.races.map((race) => (
            <Table.Tr key={race.id}>
              <Table.Td className="font-medium">
                <Link to={`${race.id}`}>{race.name}</Link>
              </Table.Td>
              <Table.Td>{race.year}</Table.Td>
              <Table.Td className={"whitespace-pre"}>{race.description}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}
