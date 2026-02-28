import {FormFooter} from "@/components/FormFooter.tsx"
import parseDjangoErrors from "@/lib/parseDjangoErrors.ts"
import {PATH_LOGIN} from "@/routes.tsx"
import {gql} from "@apollo/client"
import {useMutation} from "@apollo/client/react"
import {Group, PasswordInput, TextInput} from "@mantine/core"
import {useForm} from "@mantine/form"
import {useNavigate} from "react-router"

const REGISTER_MUTATION = gql`
  mutation RegisterMutation($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      ok
    }
  }
`

interface RegisterResponse {
  register: {
    ok: boolean
  }
}

type RiderInput = {
  name: string
  email: string
  password: string
}

export const RegisterPage = () => {
  const navigate = useNavigate()

  const [doLogin, {loading: awaitingMutation, error}] = useMutation<RegisterResponse>(REGISTER_MUTATION)

  const form = useForm<RiderInput>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const handleSubmit = (data: RiderInput) => {
    doLogin({variables: data})
      .then((authResponse) => {
        if (authResponse.data?.register.ok) {
          navigate(PATH_LOGIN, {replace: true})
        }
      })
      .catch((errorLike) => form.setErrors(parseDjangoErrors(errorLike)))
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group>
        <TextInput type={"name"} label={"Name"} {...form.getInputProps("name")} className={"w-100"} autoFocus />
      </Group>
      <Group>
        <TextInput type={"email"} label={"Email"} {...form.getInputProps("email")} className={"w-100"} />
      </Group>
      <Group>
        <PasswordInput label={"Password"} {...form.getInputProps("password")} className={"w-100"} />
      </Group>
      <FormFooter buttonTitle={"Register"} awaitingMutation={awaitingMutation} error={error} form={form} />
    </form>
  )
}
