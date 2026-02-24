import {Loading} from "@/components/Loading.tsx"
import {RaceDayFinishingDisplay} from "@/components/locationDisplay/RaceDayFinishingDisplay.tsx"
import {RaceDayStartingDisplay} from "@/components/locationDisplay/RaceDayStartingDisplay.tsx"
import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import {
  type DeleteRaceResponse,
  GQL_RACE_MUTATION_DELETE,
  GQL_RACE_SUMMARY,
  GQL_RACES,
  type RaceSummaryResponse,
} from "@/lib/gql/bakers/races.ts"
import {NotFoundPage} from "@/pages/NotFoundPage.tsx"
import {useMutation, useQuery} from "@apollo/client/react"
import {Button, Card, Table} from "@mantine/core"
import {useModals} from "@mantine/modals"
import {notifications} from "@mantine/notifications"
import {Link, useNavigate, useParams} from "react-router"

export const RacePage = () => {
  const modals = useModals()
  const navigate = useNavigate()
  const {raceId} = useParams()

  const [doDelete] = useMutation<DeleteRaceResponse>(GQL_RACE_MUTATION_DELETE)

  const {data} = useQuery<RaceSummaryResponse>(GQL_RACE_SUMMARY, {
    variables: {
      id: raceId,
    },
  })

  if (!data) return <Loading />

  if (!data.race) return <NotFoundPage />

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: `Delete '${data.race.name}'?`,
      centered: true,
      children: (
        <div>
          Are you sure you want to delete this race? This will destroy all data associated with the race including team
          times
        </div>
      ),
      labels: {confirm: "Delete race", cancel: "No don't delete it"},
      confirmProps: {color: "red"},
      onConfirm: () =>
        doDelete({
          variables: {
            id: raceId,
          },
          refetchQueries: [GQL_RACES],
          awaitRefetchQueries: true,
        }).then((saveResponse) => {
          if (!saveResponse) return

          if (saveResponse.data?.deleteRace.ok) {
            notifications.show({
              message: `'${data.race.name}' deleted'`,
            })
            navigate("/bakers")
          }
        }),
    })

  return (
    <>
      <PageHeader
        breadCrumbs={[{label: "Bakers", to: "/bakers"}, {label: `${data.race.year} - ${data.race.name}`}]}
        staffActions={
          <div className={"flex gap-4"}>
            <Link to={`/bakers/races/${data.race.id}/new`}>
              <Button color={"green"}>Add Day</Button>
            </Link>
            <Link to={`/bakers/races/${data.race.id}/edit`}>
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

      {data.race.description.trim() && (
        <Card shadow="sm" padding="md" radius="md" withBorder className={"mx-2 my-4 fit-content"}>
          {data.race.description}
        </Card>
      )}

      <div className={"flex flex-col gap-6 ps-2"}>
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
                <Table.Th>Start</Table.Th>
                <Table.Th>Finish</Table.Th>
                <Table.Th>Description</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.raceDays.map((raceDay, index) => (
                <Table.Tr key={raceDay.id}>
                  <Table.Td>
                    <Link to={`/bakers/races/${raceId}/${raceDay.id}`}>Day {index + 1}</Link>
                  </Table.Td>
                  <Table.Td>
                    <RaceDayStartingDisplay raceDay={raceDay} />
                  </Table.Td>
                  <Table.Td>
                    <RaceDayFinishingDisplay raceDay={raceDay} />
                  </Table.Td>
                  <Table.Td className={"whitespace-pre"}>{raceDay.description}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </>
  )
}
