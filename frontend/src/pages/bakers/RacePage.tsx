import type {Race, RaceDay} from "@/lib/types/bakers.ts"
import {useUserContext} from "@/lib/userContext/userContext.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {useParams} from "react-router"

interface RaceSummary {
  teamId: number
  teamName: string
  totalDurationHours: string
}

interface RaceDaysResponse {
  race: Race
  raceDays: RaceDay[]
  raceSummary: RaceSummary[]
}

const GQL_RACE_DAY_LIST = gql`
  query Race($raceId: String!, $offset: Int, $limit: Int) {
    race(id: $raceId) {
      id
      year
      name
    }
    raceDays(raceId: $raceId, offset: $offset, limit: $limit) {
      id
      day
    }
    raceSummary(raceId: $raceId) {
      teamId
      teamName
      totalDurationHours
    }
  }
`

export const RacePage = () => {
  const {currentUser} = useUserContext()
  const {raceId} = useParams()

  const {data, loading} = useQuery<RaceDaysResponse>(GQL_RACE_DAY_LIST, {
    variables: {
      raceId: raceId,
    },
  })

  if (!data || loading) return null

  return (
    <>
      sdsdf
      {/*<div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">*/}
      {/*  <Heading>Name: {data.race.name}</Heading>*/}
      {/*  <div className="flex gap-4">*/}
      {/*    {currentUser?.isStaff && (*/}
      {/*      <Link to={`/bakers/races/${data.race.id}/edit`}>*/}
      {/*        <Button>Edit</Button>*/}
      {/*      </Link>*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className="card w-100 shadow-lg">*/}
      {/*  <div className="card-body">*/}
      {/*    <Table>*/}
      {/*      <TableHead>*/}
      {/*        <TableRow>*/}
      {/*          <TableHeader>Team</TableHeader>*/}
      {/*          <TableHeader>Total Time</TableHeader>*/}
      {/*        </TableRow>*/}
      {/*      </TableHead>*/}
      {/*      <TableBody>*/}
      {/*        {data.raceSummary.map((summaryRecord) => {*/}
      {/*          return (*/}
      {/*            <TableRow key={summaryRecord.teamId}>*/}
      {/*              <TableCell className="font-medium">{summaryRecord.teamName}</TableCell>*/}
      {/*              <TableCell className="font-medium">{summaryRecord.totalDurationHours}</TableCell>*/}
      {/*            </TableRow>*/}
      {/*          )*/}
      {/*        })}*/}
      {/*      </TableBody>*/}
      {/*    </Table>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className="card w-100 shadow-lg">*/}
      {/*  <div className="card-body">*/}
      {/*    <Table>*/}
      {/*      <TableHead>*/}
      {/*        <TableRow>*/}
      {/*          <TableHeader>Day</TableHeader>*/}
      {/*        </TableRow>*/}
      {/*      </TableHead>*/}
      {/*      <TableBody>*/}
      {/*        {data.raceDays.map((raceDay) => (*/}
      {/*          <TableRow key={raceDay.id}>*/}
      {/*            <TableCell className="font-medium">*/}
      {/*              <Link to={`${raceDay.day}`}>Day {raceDay.day}</Link>*/}
      {/*            </TableCell>*/}
      {/*          </TableRow>*/}
      {/*        ))}*/}
      {/*      </TableBody>*/}
      {/*    </Table>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  )
}
