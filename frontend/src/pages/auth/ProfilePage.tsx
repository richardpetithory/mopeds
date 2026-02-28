import {Loading} from "@/components/Loading.tsx"
import {type CurrentRiderInfoResponse, GQL_CURRENT_RIDER_INFO} from "@/lib/gql/users.ts"
import type {Rider} from "@/lib/models/users.ts"
import {useRiderContext} from "@/lib/userContext/riderContext.ts"
import {gql} from "@apollo/client"
import {useMutation, useQuery} from "@apollo/client/react"
import {Alert, Button, Group, TextInput} from "@mantine/core"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {type ChangeEvent} from "react"
import {useNavigate} from "react-router"

export interface SaveProfileInput {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export const GQL_PROFILE_MUTATION_SAVE = gql`
  mutation ProfileMutation($name: String!, $email: String!, $password: String!) {
    profile(name: $name, email: $email, password: $password) {
      rider {
        id
      }
    }
  }
`

export interface SaveProfileResponse {
  rider: Rider
}

export const ProfilePage = () => {
  const {currentRider} = useRiderContext()

  const {data, loading: loadingRider} = useQuery<CurrentRiderInfoResponse>(GQL_CURRENT_RIDER_INFO)

  if (loadingRider) return <Loading />
  if (!currentRider?.id) return null

  return <ProfilePageForm rider={data!.currentRider} />
}

const ProfilePageForm = ({rider}: {rider: Rider}) => {
  const navigate = useNavigate()

  const [doSave, {loading: awaitingMutation, error}] = useMutation<SaveProfileResponse>(GQL_PROFILE_MUTATION_SAVE, {
    refetchQueries: [GQL_CURRENT_RIDER_INFO],
  })

  const {onSubmit, getInputProps, isDirty, setFieldValue, validateField, getDirty} = useForm<SaveProfileInput>({
    initialValues: {
      ...rider,
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: (value) => (value ? null : "Name is required"),
      password: (value, values) => {
        console.log("validating confirm password", value, values.confirmPassword)
        return value !== values.confirmPassword ? "Passwords don't match" : null
      },
      confirmPassword: (value, values) => {
        console.log("validating confirm password", value, values.password)
        return value !== values.confirmPassword ? "Passwords don't match" : null
      },
    },
  })

  const handleSubmit = (data: SaveProfileInput) => {
    doSave({variables: data}).then((saveResponse) => {
      if (saveResponse.data) {
        notifications.show({
          message: "Profile saved successfully",
        })

        navigate("/")
      }
    })
  }

  console.log(isDirty(), getDirty())

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Group>
        <TextInput label={"Name"} {...getInputProps("name")} autoFocus={true} className={"w-100"} />
      </Group>
      <Group>
        <TextInput label={"Email"} type={"email"} {...getInputProps("email")} className={"w-100"} />
      </Group>
      <Group>
        <TextInput
          label={"Password"}
          type={"password"}
          className={"w-100"}
          {...getInputProps("password", {
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
              setFieldValue("password", event.currentTarget.value)
              validateField("password")
            },
          })}
        />
        <TextInput
          label={"Repeat"}
          type={"password"}
          className={"w-100"}
          {...getInputProps("confirmPassword", {
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
              setFieldValue("confirmPassword", event.currentTarget.value)
              validateField("confirmPassword")
            },
          })}
        />
      </Group>
      <Group>
        <Button type={"submit"} disabled={awaitingMutation || !isDirty()}>
          Save
        </Button>
      </Group>
      {error?.message && error?.message !== "NONE" && (
        <Alert variant={"filled"} color={"red"} className={"fit-content"}>
          {error?.message}
        </Alert>
      )}
    </form>
  )
}
