import {Loading} from "@/components/Loading.tsx"
import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import {RaceDayFinishingDisplay} from "@/components/locationDisplay/RaceDayFinishingDisplay.tsx"
import {RaceDayStartingDisplay} from "@/components/locationDisplay/RaceDayStartingDisplay.tsx"
import {formatDatetime, formatTimeString} from "@/lib/formatting.ts"
import {
  type DeleteRaceDayResponse,
  GQL_RACE_DAY_MUTATION_DELETE,
  GQL_RACE_DAY_SUMMARY,
  GQL_RACE_SUMMARY,
  type RaceDaySummaryResponse,
} from "@/lib/gql/bakers/races.ts"
import type {RaceTeamTime} from "@/lib/models/bakers.ts"
import {NotFoundPage} from "@/pages/NotFoundPage.tsx"
import {useMutation, useQuery} from "@apollo/client/react"
import {Button, Card, SimpleGrid, Table} from "@mantine/core"
import {modals} from "@mantine/modals"
import {notifications} from "@mantine/notifications"
import {FaRegFaceFrownOpen} from "react-icons/fa6"
import {Link, useNavigate, useParams} from "react-router"

export const RaceDayPage = () => {
  const navigate = useNavigate()
  const {raceId, dayId} = useParams()

  const [doDelete] = useMutation<DeleteRaceDayResponse>(GQL_RACE_DAY_MUTATION_DELETE)

  const {data} = useQuery<RaceDaySummaryResponse>(GQL_RACE_DAY_SUMMARY, {
    variables: {
      raceId: raceId,
      dayId: dayId,
    },
  })

  if (!data) return <Loading />

  if (data && !data?.raceDay) return <NotFoundPage />

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: `Delete '${data.race.name}' day ${data.raceDay.dayNumber}?`,
      centered: true,
      children: (
        <div>
          Are you sure you want to delete this race day? This will destroy all data associated with the race including
          team times
        </div>
      ),
      labels: {confirm: "Delete race day", cancel: "No don't delete it"},
      confirmProps: {color: "red"},
      onConfirm: () =>
        doDelete({
          variables: {
            id: data.raceDay.id,
          },
          refetchQueries: [GQL_RACE_SUMMARY],
          awaitRefetchQueries: true,
        }).then((saveResponse) => {
          if (!saveResponse) return

          if (saveResponse.data?.deleteRaceDay.ok) {
            notifications.show({
              message: `'${data.race.name}' deleted'`,
            })
            navigate(`/bakers/races/${raceId}`)
          }
        }),
    })

  return (
    <>
      <PageHeader
        breadCrumbs={[
          {label: "Bakers", to: "/bakers"},
          {label: `${data.race.year} - ${data.race.name}`, to: `/bakers/races/${data.race.id}`},
          {label: `Day ${dayId}`},
        ]}
        staffActions={
          <div className={"flex gap-4"}>
            <Link to={`/bakers/races/${data.race.id}/${dayId}/new`}>
              <Button color={"green"}>Add Team Time</Button>
            </Link>
            <Link to={`/bakers/races/${data.race.id}/${dayId}/edit`}>
              <Button>Edit</Button>
            </Link>
          </div>
        }
        adminActions={
          <Button onClick={openDeleteModal} color="red">
            Delete
          </Button>
        }
      />

      {data.raceDay.description && (
        <Card shadow="sm" padding="md" radius="md" withBorder className={"mx-2 my-4 fit-content whitespace-pre"}>
          {data.raceDay.description}
        </Card>
      )}

      <SimpleGrid cols={2} className={"mx-2 my-4 fit-content"}>
        <div>Starting Time:</div>
        <div>{formatDatetime(data.raceDay.startingDatetime)}</div>

        <div>Starting:</div>
        <RaceDayStartingDisplay locationValues={data.raceDay} />

        <div>Finishing:</div>
        <RaceDayFinishingDisplay locationValues={data.raceDay} />
      </SimpleGrid>

      <Table className="fit-content">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Team</Table.Th>
            <Table.Th>Finish Time</Table.Th>
            <Table.Th>DNF</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.raceTeamTimes.map((raceTeamTime: RaceTeamTime) => (
            <Table.Tr key={raceTeamTime.id}>
              <Table.Td>
                <Link to={`/bakers/teams/${raceTeamTime.raceTeam.team.id}`}>{raceTeamTime.raceTeam.team.name}</Link>
              </Table.Td>
              <Table.Td>
                <Link
                  to={`/bakers/races/${raceTeamTime.raceTeam.race.id}/${raceTeamTime.raceTeam.team.id}/${raceTeamTime.id}`}
                >
                  {!raceTeamTime.dnf ? formatTimeString(raceTeamTime.finishTime) : "-"}
                </Link>
              </Table.Td>
              <Table.Td>{raceTeamTime.dnf ? <FaRegFaceFrownOpen color={"orange"} size={20} /> : null}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}
