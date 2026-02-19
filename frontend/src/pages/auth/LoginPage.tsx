import {GQL_CURRENT_USER_INFO, useUserContext} from "@/lib/userContext/userContext.ts"
import {gql} from "@apollo/client"
import {useMutation} from "@apollo/client/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {Alert, Button, Group, TextInput} from "@mantine/core"
import {type SubmitHandler, useForm} from "react-hook-form"
import {useNavigate} from "react-router"
import * as yup from "yup"

type Credentials = {
  email: string
  password: string
}

type TokenAuthResponse = {
  tokenAuth: {
    token: string
  }
}

const LOGIN_MUTATION = gql`
  mutation TokenAuth($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
    }
  }
`

const schema = yup.object().shape({
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
})

export const LoginPage = () => {
  const {setToken} = useUserContext()
  const navigate = useNavigate()

  const [doLogin, {loading: awaitingMutation, error}] = useMutation<TokenAuthResponse>(LOGIN_MUTATION, {
    refetchQueries: [GQL_CURRENT_USER_INFO],
  })

  const {
    register,
    handleSubmit,

    formState: {errors},
  } = useForm<Credentials>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "admin",
      password: "admin",
    },
  })

  const onSubmit: SubmitHandler<Credentials> = (data) => {
    doLogin({variables: data}).then((authResponse) => {
      if (authResponse.data?.tokenAuth.token) {
        setToken(authResponse.data?.tokenAuth.token || null)

        navigate("/", {replace: true})
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Group>
        <TextInput label={"Email"} {...register("email")} autoFocus={true} error={errors?.email?.message} />
      </Group>
      <Group>
        <TextInput label={"Password"} {...register("password")} type={"password"} error={errors?.password?.message} />
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
