import {Loading} from "@/components/Loading.tsx"
import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import {RaceName} from "@/components/RaceName.tsx"
import {RiderName} from "@/components/RiderName.tsx"
import {formatFilename} from "@/lib/formatting.ts"
import {GQL_TEAM_SUMMARY, type TeamSummaryResponse} from "@/lib/gql/bakers/teams.ts"
import {useRiderContext} from "@/lib/userContext/riderContext.ts"
import {NotFoundPage} from "@/pages/NotFoundPage.tsx"
import {useQuery} from "@apollo/client/react"
import {Button, Card, Image, SimpleGrid, Table} from "@mantine/core"
import {Link, useParams} from "react-router"

export const TeamPage = () => {
  const {teamId} = useParams()
  const {currentRider} = useRiderContext()

  const {data} = useQuery<TeamSummaryResponse>(GQL_TEAM_SUMMARY, {
    variables: {
      teamId: teamId,
    },
  })

  if (!data) return <Loading />

  if (!data.team) return <NotFoundPage />

  return (
    <>
      <PageHeader
        breadCrumbs={[{label: "Bakers", to: "/bakers"}, {label: "Teams", to: "/bakers/teams"}, {label: data.team.name}]}
        staffActions={
          <>
            {(currentRider?.id === data?.team?.manager?.id || currentRider?.isStaff) && (
              <>
                <Link to={`/bakers/teams/${data.team.id}/invite`}>
                  <Button color={"green"}>Invite Member to Race</Button>
                </Link>

                <Link to={`/bakers/teams/${data.team.id}/joinRace`}>
                  <Button>Join Race</Button>
                </Link>

                <Link to={`/bakers/teams/${data.team.id}/edit`}>
                  <Button>Edit</Button>
                </Link>
              </>
            )}
          </>
        }
      />

      {data.team.description && (
        <Card shadow="sm" padding="md" radius="sm" withBorder className={"mx-2 my-4 fit-content"}>
          {data.team.description}
        </Card>
      )}

      {data.team.logo && (
        <Image
          src={formatFilename(data.team.logo)}
          alt={`${data.team.name} logo`}
          className={"max-h-96 max-w-96 object-contain"}
        />
      )}

      <SimpleGrid cols={2} className={"mx-2 my-4 fit-content"}>
        <div>Team Manager:</div>
        <RiderName rider={data.team.manager} />
      </SimpleGrid>

      <div className={"flex flex-col gap-2 ps-2"}>
        <div>
          <h1>Races</h1>
          <Table className="fit-content">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Race</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.teamRaces.map((teamRace) => (
                <Table.Tr key={teamRace.race.id}>
                  <Table.Td className="font-medium">
                    <Link to={`/bakers/races/${teamRace.race.id}`}>
                      {teamRace.race.year} - {teamRace.race.name}
                    </Link>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        <div>
          <h1>Riders</h1>
          <Table className="fit-content">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Race</Table.Th>
                <Table.Th>Rider</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.raceTeamMemberships.map((raceTeamMembership) => (
                <Table.Tr key={raceTeamMembership.id}>
                  <Table.Td className="font-medium">
                    <RaceName race={raceTeamMembership.race} />
                  </Table.Td>
                  <Table.Td className="font-medium">
                    <RiderName rider={raceTeamMembership.member} />
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
