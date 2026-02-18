import type {RaceTeamTime} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {useParams} from "react-router"

export interface RaceTeamTimesResponse {
  raceTeamTimes: RaceTeamTime[]
}

export const GQL_RACE_TEAM_TIME_LIST = gql`
  query RaceTeamTimes($raceId: String!, $raceDay: String!, $offset: Int, $limit: Int) {
    raceTeamTimes(raceId: $raceId, raceDay: $raceDay, offset: $offset, limit: $limit) {
      id
      day {
        day
      }
      raceTeam {
        team {
          name
        }
      }
      duration
      dnf
    }
  }
`

export const RaceTeamTimesPage = () => {
  const {raceId, day} = useParams()

  const {data, loading} = useQuery<RaceTeamTimesResponse>(GQL_RACE_TEAM_TIME_LIST, {
    variables: {
      raceId: raceId,
      raceDay: day,
    },
  })

  if (!data || loading) return null

  return (
    <>sdf</>
    // <Table>
    //   <TableHead>
    //     <TableRow>
    //       <TableHeader>Team</TableHeader>
    //       <TableHeader>Minutes Total</TableHeader>
    //       <TableHeader>Minutes</TableHeader>
    //       <TableHeader>DNF</TableHeader>
    //     </TableRow>
    //   </TableHead>
    //   <TableBody>
    //     {data.raceTeamTimes.map((raceTeamTime: RaceTeamTime) => (
    //       <TableRow key={raceTeamTime.id}>
    //         <TableCell className="font-medium">{raceTeamTime.raceTeam.team.name}</TableCell>
    //         <TableCell className="font-medium">{raceTeamTime.duration}</TableCell>
    //         <TableCell className="font-medium">{raceTeamTime.dnf}</TableCell>
    //       </TableRow>
    //     ))}
    //   </TableBody>
    // </Table>
  )
}
