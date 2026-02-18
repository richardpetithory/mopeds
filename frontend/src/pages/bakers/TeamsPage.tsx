import type {Team} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"

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
  const {data, loading} = useQuery<TeamsResponse>(GQL_TEAMS_LIST)

  if (!data || loading) return null

  return (
    <>sdf</>
    // <Table>
    //   <TableHead>
    //     <TableRow>
    //       <TableHeader>Name</TableHeader>
    //     </TableRow>
    //   </TableHead>
    //   <TableBody>
    //     {data.teams.map((team) => (
    //       <TableRow key={team.id}>
    //         <TableCell className="font-medium">
    //           <Link to={`${team.id}`}>{team.name}</Link>
    //         </TableCell>
    //       </TableRow>
    //     ))}
    //   </TableBody>
    // </Table>
  )
}
