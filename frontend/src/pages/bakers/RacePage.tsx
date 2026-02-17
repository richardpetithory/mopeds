import type {RaceDay} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@catalyst/table.tsx"
import {Link, useParams} from "react-router"

export interface RaceDaysResponse {
  raceDays: RaceDay[]
  raceSummary: {
    teamName: string
    totalDurationHours: string
  }[]
}

export const GQL_RACE_DAY_LIST = gql`
  query Race($racePk: String!, $offset: Int, $limit: Int) {
    raceDays(racePk: $racePk, offset: $offset, limit: $limit) {
      id
      day
    }
    raceSummary(racePk: $racePk) {
      teamName
      totalDurationHours
    }
  }
`

export const RacePage = () => {
  const {racePk} = useParams()

  const {data, loading} = useQuery<RaceDaysResponse>(GQL_RACE_DAY_LIST, {
    variables: {
      racePk: racePk,
    },
  })

  if (!data || loading) return null

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Team</TableHeader>
            <TableHeader>Total Time</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.raceSummary.map((summaryRecord) => (
            <TableRow key={summaryRecord.teamName}>
              <TableCell className="font-medium">{summaryRecord.teamName}</TableCell>
              <TableCell>{summaryRecord.totalDurationHours}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Day</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.raceDays.map((raceDay) => (
            <TableRow key={raceDay.id}>
              <TableCell className="font-medium">
                <Link to={`${raceDay.day}`}>{raceDay.day}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
