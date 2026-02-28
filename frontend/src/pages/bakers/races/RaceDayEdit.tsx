import {Loading} from "@/components/Loading.tsx"
import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import {
  GQL_RACE_DAY_MUTATION_SAVE,
  GQL_RACE_SUMMARY,
  type SaveRaceDayInput,
  type SaveRaceDayResponse,
} from "@/lib/gql/bakers/races.ts"
import type {Race, RaceDay} from "@/lib/models/bakers.ts"
import {NotFoundPage} from "@/pages/NotFoundPage.tsx"
import {gql} from "@apollo/client"
import {useMutation, useQuery} from "@apollo/client/react"
import {Alert, Button, Group, Switch, Textarea, TextInput} from "@mantine/core"
import {DateTimePicker} from "@mantine/dates"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {set} from "date-fns"
import {pick} from "lodash"
import {useState} from "react"
import {useNavigate, useParams} from "react-router"

const GQL_DEPENDENCY_DATA = gql`
  query RaceDays($raceDayId: String!, $raceId: String!) {
    race(id: $raceId) {
      id
      name
      year
    }
    raceDay(id: $raceDayId) {
      id
      previousDay {
        id
        finishingAddress
        finishingAddressCoordinates
        finishingLocation
      }
      dayNumber
      description
      dayOff
      startingIsPreviousFinish
      startingAddress
      startingAddressCoordinates
      startingLocation
      finishingAddress
      finishingAddressCoordinates
      finishingLocation
    }
    lastDayForRace(raceId: $raceId) {
      finishingAddress
      finishingAddressCoordinates
      finishingLocation
    }
  }
`

export interface DependencyData {
  race: Race
  raceDay: RaceDay
  lastDayForRace: RaceDay
}

export const RaceDayEdit = () => {
  const {raceId, dayId} = useParams()

  const {data: dependencyData, loading: loadingDependencyData} = useQuery<DependencyData>(GQL_DEPENDENCY_DATA, {
    fetchPolicy: "network-only",
    variables: {
      raceId: raceId,
      raceDayId: dayId || "",
    },
  })

  if (!raceId) return <NotFoundPage />

  if (loadingDependencyData) return <Loading />

  return <RaceDayEditForm raceId={raceId} dependencyData={dependencyData!} />
}

interface RaceDayEditFormProps {
  raceId: string
  dependencyData: DependencyData
}

type RaceDayFinishValues = Pick<
  SaveRaceDayInput,
  "finishingAddress" | "finishingAddressCoordinates" | "finishingLocation"
>

const RaceDayEditForm = ({raceId, dependencyData}: RaceDayEditFormProps) => {
  const navigate = useNavigate()

  const [originalFinishValues, setOriginalFinishValues] = useState<RaceDayFinishValues>({
    finishingAddress: dependencyData?.raceDay?.finishingAddress || "",
    finishingAddressCoordinates: dependencyData?.raceDay?.finishingAddressCoordinates || "",
    finishingLocation: dependencyData?.raceDay?.finishingLocation || "",
  })

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveRaceDayResponse>(GQL_RACE_DAY_MUTATION_SAVE)

  const {watch, setValues, onSubmit, getInputProps, values} = useForm<SaveRaceDayInput>({
    initialValues: dependencyData.raceDay
      ? {...dependencyData.raceDay, raceId: dependencyData.race.id, dayId: dependencyData.raceDay.id}
      : {
          raceId: raceId || "",
          dayId: "",
          dayNumber: null,
          description: "",
          dayOff: false,
          startingDatetime: set(new Date(), {
            hours: 10,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
          }),
          startingIsPreviousFinish: true,
          startingAddress: "",
          startingAddressCoordinates: "",
          startingLocation: "",

          finishingAddress: "",
          finishingAddressCoordinates: "",
          finishingLocation: "",

          commentary: "",
        },
    validate: {},
  })

  watch("dayOff", ({value}) => {
    if (value) {
      setOriginalFinishValues(pick(values, ["finishingAddress", "finishingAddressCoordinates", "finishingLocation"]))
      setValues(
        pick(dependencyData?.lastDayForRace, ["finishingAddress", "finishingAddressCoordinates", "finishingLocation"])
      )
    } else {
      setValues(originalFinishValues)
    }
  })

  const handleSubmit = (data: SaveRaceDayInput) => {
    doSave({
      variables: data,
      refetchQueries: [
        {
          query: GQL_RACE_SUMMARY,
          variables: {
            id: raceId,
          },
        },
      ],
    }).then((saveResponse) => {
      if (saveResponse.data) {
        notifications.show({
          message: `Race day ${saveResponse.data.saveRaceDay.raceDay.dayNumber} added`,
        })

        navigate(`/bakers/races/${raceId}`)
      }
    })
  }

  return (
    <>
      <PageHeader
        breadCrumbs={[
          {label: "Bakers", to: "/bakers"},
          {
            label: `${dependencyData.race.year} - ${dependencyData.race.name}`,
            to: `/bakers/races/${dependencyData.race.id}`,
          },
          {label: dependencyData?.raceDay?.dayNumber ? `Day ${dependencyData?.raceDay.dayNumber}` : "New"},
        ]}
      />

      <form onSubmit={onSubmit(handleSubmit)} className={"page-form"}>
        <Group>
          <TextInput
            label={"Day #"}
            {...getInputProps("dayNumber")}
            value={getInputProps("dayNumber").value ?? ""}
            disabled={true}
            placeholder={"Auto-generated"}
          />
        </Group>
        <Group>
          <Switch label={"Day off!"} {...getInputProps("dayOff", {type: "checkbox"})} />
        </Group>
        {!values.dayOff && (
          <>
            <Group>
              <DateTimePicker
                label={"Starting Date & Time"}
                {...getInputProps("startingDatetime")}
                valueFormat="MMM DD, YYYY @ hh:mm A"
                timePickerProps={{format: "12h"}}
              />
            </Group>
            <Group>
              <Switch
                label={"Starting location is the same as previous day finish line"}
                {...getInputProps("startingIsPreviousFinish", {type: "checkbox"})}
              />
            </Group>
            {!values.startingIsPreviousFinish && (
              <>
                <Group>
                  <Textarea
                    label={"Starting Address"}
                    {...getInputProps("startingAddress")}
                    rows={4}
                    className={"w-100"}
                  />
                </Group>
                <Group>
                  <TextInput
                    label={"Starting Address Coordinates"}
                    {...getInputProps("startingAddressCoordinates")}
                    className={"w-100"}
                  />
                </Group>
                <Group className={"pb-0"}>
                  <TextInput
                    label={"Starting Location"}
                    {...getInputProps("startingLocation")}
                    className={"w-100"}
                    description={"Short display name of the address"}
                  />
                </Group>
              </>
            )}

            <Group>
              <Textarea
                label={"Finishing Address"}
                {...getInputProps("finishingAddress")}
                rows={4}
                className={"w-100"}
              />
            </Group>
            <Group>
              <TextInput
                label={"Finishing Address Coordinates"}
                {...getInputProps("finishingAddressCoordinates")}
                className={"w-100"}
              />
            </Group>
            <Group>
              <TextInput
                label={"Finishing Location"}
                {...getInputProps("finishingLocation")}
                className={"w-100"}
                description={"Short display name of the address"}
              />
            </Group>
          </>
        )}

        <Group>
          <Textarea
            label={"Description"}
            placeholder={"A description of what people should expect for that day"}
            {...getInputProps("description")}
            rows={10}
            className={"w-100"}
          />
        </Group>
        <Group>
          <Textarea
            label={"Day Summary"}
            placeholder={"A summary of how the race went that day"}
            {...getInputProps("commentary")}
            rows={10}
            className={"w-100"}
          />
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
    </>
  )
}
