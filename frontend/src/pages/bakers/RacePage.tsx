import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import type {Race, RaceDay} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {Button, Center, Loader, Table} from "@mantine/core"
import {Link, useParams} from "react-router"

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
  const {raceId} = useParams()

  const {data} = useQuery<RaceDaysResponse>(GQL_RACE_DAY_LIST, {
    variables: {
      raceId: raceId,
    },
  })

  if (!data)
    return (
      <Center>
        <Loader />
      </Center>
    )

  return (
    <>
      <PageHeader
        breadCrumbs={[{label: "Bakers", to: "/bakers"}, {label: `${data.race.year} - ${data.race.name}`}]}
        staffActions={
          <Link to={`/bakers/races/${data.race.id}/edit`}>
            <Button>Edit</Button>
          </Link>
        }
      />

      <div className={"flex flex-col gap-5"}>
        <div>
          <h1>Race Results</h1>
          <Table className="fit-content">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Team</Table.Th>
                <Table.Th>Total Time</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.raceSummary.map((summaryRecord) => (
                <Table.Tr key={summaryRecord.teamId}>
                  <Table.Td className="font-medium">
                    <Link to={`/bakers/teams/${summaryRecord.teamId}`}>{summaryRecord.teamName}</Link>
                  </Table.Td>
                  <Table.Td>{summaryRecord.totalDurationHours}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        <div>
          <h1>Race Days</h1>
          <Table className="fit-content">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Day</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.raceDays.map((raceDay) => (
                <Table.Tr key={raceDay.id}>
                  <Table.Td className="font-medium">
                    <Link to={`/bakers/races/${raceId}/${raceDay.day}`}>Day {raceDay.day}</Link>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </>
  )
}
