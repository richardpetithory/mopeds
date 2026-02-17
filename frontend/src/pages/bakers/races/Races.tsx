import type {Race} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@catalyst/table.tsx"
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

export const Races = () => {
  const {data, loading} = useQuery<RacesResponse>(GQL_RACES_LIST)

  if (!data || loading) return null

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Year</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.races.map((race) => (
          <TableRow key={race.id}>
            <TableCell className="font-medium">
              <Link to={`${race.id}`}>{race.name}</Link>
            </TableCell>
            <TableCell>{race.year}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
