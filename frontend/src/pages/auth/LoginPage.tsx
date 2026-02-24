import {LOGIN_MUTATION, type TokenAuthResponse} from "@/lib/gql/mopeds.ts"
import {GQL_CURRENT_RIDER_INFO} from "@/lib/gql/users.ts"
import {useRiderContext} from "@/lib/userContext/riderContext.ts"
import {useMutation} from "@apollo/client/react"
import {Alert, Button, Group, PasswordInput, TextInput} from "@mantine/core"
import {useForm} from "@mantine/form"
import {useNavigate} from "react-router"

type Credentials = {
  email: string
  password: string
}

export const LoginPage = () => {
  const {setToken} = useRiderContext()
  const navigate = useNavigate()

  const [doLogin, {loading: awaitingMutation, error}] = useMutation<TokenAuthResponse>(LOGIN_MUTATION, {
    refetchQueries: [GQL_CURRENT_RIDER_INFO],
  })

  const {onSubmit, getInputProps} = useForm<Credentials>({
    initialValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = (data: Credentials) => {
    doLogin({variables: data}).then((authResponse) => {
      if (authResponse.data?.tokenAuth.token) {
        setToken(authResponse.data?.tokenAuth.token || null)

        navigate("/", {replace: true})
      }
    })
  }

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Group>
        <TextInput type={"email"} label={"Email"} {...getInputProps("email")} className={"w-100"} />
      </Group>
      <Group>
        <PasswordInput label={"Password"} {...getInputProps("password")} className={"w-100"} />
      </Group>
      <Group>
        <Button type={"submit"} disabled={awaitingMutation}>
          Log In
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
