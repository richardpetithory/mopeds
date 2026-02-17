import type {RaceTeamTime} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@catalyst/table.tsx"
import {useParams} from "react-router"

export interface RaceTeamTimesResponse {
  raceTeamTimes: RaceTeamTime[]
}

export const GQL_RACE_TEAM_TIME_LIST = gql`
  query RaceTeamTimes($racePk: String!, $raceDay: String!, $offset: Int, $limit: Int) {
    raceTeamTimes(racePk: $racePk, raceDay: $raceDay, offset: $offset, limit: $limit) {
      id
      day {
        day
      }
      raceTeam {
        team {
          name
        }
      }
      hours
      minutes
      dnf
    }
  }
`

export const RaceTeamTimes = () => {
  const {racePk, day} = useParams()

  const {data, loading} = useQuery<RaceTeamTimesResponse>(GQL_RACE_TEAM_TIME_LIST, {
    variables: {
      racePk: racePk,
      raceDay: day,
    },
  })

  if (!data || loading) return null

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Team</TableHeader>
          <TableHeader>Hours</TableHeader>
          <TableHeader>Minutes</TableHeader>
          <TableHeader>DNF</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.raceTeamTimes.map((raceTeamTime: RaceTeamTime) => (
          <TableRow key={raceTeamTime.id}>
            <TableCell className="font-medium">{raceTeamTime.raceTeam.team.name}</TableCell>
            <TableCell className="font-medium">{raceTeamTime.hours}</TableCell>
            <TableCell className="font-medium">{raceTeamTime.minutes}</TableCell>
            <TableCell className="font-medium">{raceTeamTime.dnf}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
