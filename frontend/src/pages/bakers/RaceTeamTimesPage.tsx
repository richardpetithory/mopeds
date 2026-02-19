import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import type {Race, RaceTeamTime} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {Center, Loader, Table} from "@mantine/core"
import {Link, useParams} from "react-router"

export interface RaceTeamTimesResponse {
  race: Race
  raceTeamTimes: RaceTeamTime[]
}

export const GQL_RACE_TEAM_TIME_LIST = gql`
  query RaceTeamTimes($raceId: String!, $raceDay: String!, $offset: Int, $limit: Int) {
    race(id: $raceId) {
      id
      year
      name
    }
    raceTeamTimes(raceId: $raceId, raceDay: $raceDay, offset: $offset, limit: $limit) {
      id
      day {
        day
      }
      raceTeam {
        team {
          id
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

  const {data} = useQuery<RaceTeamTimesResponse>(GQL_RACE_TEAM_TIME_LIST, {
    variables: {
      raceId: raceId,
      raceDay: day,
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
        breadCrumbs={[
          {label: "Bakers", to: "/bakers"},
          {label: `${data.race.year} - ${data.race.name}`, to: `/bakers/races/${data.race.id}`},
          {label: `Day ${day}`},
        ]}
      />

      <Table className="fit-content">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Team</Table.Th>
            <Table.Th>Total Time</Table.Th>
            <Table.Th>DNF</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.raceTeamTimes.map((raceTeamTime: RaceTeamTime) => (
            <Table.Tr key={raceTeamTime.id}>
              <Table.Td>
                <Link to={`/bakers/teams/${raceTeamTime.raceTeam.team.id}`}>{raceTeamTime.raceTeam.team.name}</Link>
              </Table.Td>
              <Table.Td>{raceTeamTime.duration}</Table.Td>
              <Table.Td>{raceTeamTime.dnf}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}
