import {Loading} from "@/components/Loading.tsx"
import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import type {Rider} from "@/lib/models/users.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {Table} from "@mantine/core"
import {Link} from "react-router"

export interface RidersResponse {
  riders: Rider[]
}

export const GQL_RIDERS_LIST = gql`
  query Riders {
    riders {
      id
      name
    }
  }
`

export const RidersPage = () => {
  const {data} = useQuery<RidersResponse>(GQL_RIDERS_LIST)

  if (!data) return <Loading />

  return (
    <>
      <PageHeader breadCrumbs={[{label: "Riders"}]} />

      <Table className="fit-content">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Rider</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.riders.map((rider) => (
            <Table.Tr key={rider.id}>
              <Table.Td className="font-medium">
                <Link to={`/riders/${rider.id}`}>{rider.name}</Link>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}
