import {Loading} from "@/components/Loading.tsx"
import {
  GQL_RACE_DAY_SUMMARY,
  GQL_RACE_TEAM_TIME,
  GQL_RACE_TEAM_TIME_MUTATION_SAVE,
  GQL_RACE_TEAMS_WITHOUT_TIMES,
  type RaceTeamTimeResponse,
  type SaveRaceTeamTimeInput,
  type SaveRaceTeamTimeResponse,
} from "@/lib/gql/bakers/races.ts"
import {useMutation, useQuery} from "@apollo/client/react"
import {Alert, Button, Group, Select, Switch, Textarea, TextInput} from "@mantine/core"
import {TimeInput} from "@mantine/dates"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {format} from "date-fns"
import {omit} from "lodash"
import {useEffect} from "react"
import {useNavigate, useParams} from "react-router"

export const RaceTeamTimeEdit = () => {
  const navigate = useNavigate()

  const {raceId, dayId, raceTeamId} = useParams()

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveRaceTeamTimeResponse>(
    GQL_RACE_TEAM_TIME_MUTATION_SAVE
  )

  const {data, loading: loadingRace} = useQuery<RaceTeamTimeResponse>(GQL_RACE_TEAM_TIME, {
    fetchPolicy: "network-only",
    variables: {
      raceId,
      dayId,
      raceTeamId,
    },
    skip: !raceTeamId,
  })

  const {data: dependencyData, loading: loadingDependencyData} = useQuery<RaceTeamTimeResponse>(
    GQL_RACE_TEAMS_WITHOUT_TIMES,
    {
      variables: {
        raceId: raceId,
        dayId: dayId,
      },
    }
  )

  const {onSubmit, setValues, getInputProps, values} = useForm<SaveRaceTeamTimeInput>({
    initialValues: {
      id: null,
      dayId: dayId || "",
      raceTeamId: "",
      finishTime: format(new Date(), "HH:mm:ss"),
      dnf: false,
      commentary: "",
    },
    validate: {},
  })

  useEffect(() => {
    if (data?.raceTeamTime) {
      setValues({
        ...omit(data.raceTeamTime, ["raceTeam"]),
        dayId: dayId,
      })
    }
  }, [data, dayId, raceId, setValues])

  const handleSubmit = (values: SaveRaceTeamTimeInput) => {
    doSave({
      variables: {
        ...values,
        dayId: dayId,
      },
      refetchQueries: [
        {
          query: GQL_RACE_DAY_SUMMARY,
          variables: {
            raceId: raceId,
            dayId: dayId,
          },
        },
        {
          query: GQL_RACE_TEAMS_WITHOUT_TIMES,
          variables: {
            raceId: raceId,
            dayId: dayId,
          },
        },
      ],
    }).then((saveResponse) => {
      if (saveResponse.data) {
        notifications.show({
          message: `Race time added`,
        })

        navigate(`/bakers/races/${raceId}/${dayId}`)
      }
    })
  }

  if (loadingRace || loadingDependencyData) return <Loading />
  console.log(data)
  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Group>
        {raceTeamId && (
          <Group>
            <TextInput label={"Team"} value={data?.raceTeamTime.raceTeam.team.name} disabled={true} />
          </Group>
        )}
        {!raceTeamId && (
          <Select
            label={"Team"}
            data={(dependencyData?.raceTeamsWithoutTimes || []).map((raceTeam) => {
              return {
                value: raceTeam.id,
                label: raceTeam.team.name,
              }
            })}
            {...getInputProps("raceTeamId")}
          />
        )}
      </Group>
      <Group>
        <TimeInput label={"Finish Time"} {...getInputProps("finishTime")} disabled={values["dnf"]} />
      </Group>
      <Group>
        <Switch label={"DNF"} {...getInputProps("dnf")} />
      </Group>
      <Group>
        <Textarea label={"Commentary"} {...getInputProps("commentary")} />
      </Group>
      <Group>
        <Button type={"submit"} disabled={awaitingMutation}>
          Save
        </Button>
      </Group>

      {error && (
        <Alert variant={"filled"} color={"red"} className={"fit-content"}>
          {error.message}
        </Alert>
      )}
    </form>
  )
}
