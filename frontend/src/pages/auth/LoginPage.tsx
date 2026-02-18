import {GQL_CURRENT_USER_INFO, useUserContext} from "@/lib/userContext/userContext.ts"
import {gql} from "@apollo/client"
import {useMutation} from "@apollo/client/react"
import {yupResolver} from "@hookform/resolvers/yup"
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
      {/*<div className="card w-100 shadow-lg">*/}
      {/*  <div className="card-body">*/}
      {/*    <Fieldset>*/}
      {/*      <FieldGroup>*/}
      {/*        <Field>*/}
      {/*          <Label>Email</Label>*/}
      {/*          <Input {...register("email")} autoFocus={true} />*/}
      {/*          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}*/}
      {/*        </Field>*/}

      {/*        <Field>*/}
      {/*          <Label>Password</Label>*/}
      {/*          <Input type={"password"} {...register("password")} />*/}
      {/*          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}*/}
      {/*        </Field>*/}

      {/*        <Button type="submit" disabled={awaitingMutation}>*/}
      {/*          Login*/}
      {/*        </Button>*/}

      {/*        {error && (*/}
      {/*          <div className="alert alert-error" role="alert">*/}
      {/*            {error.message}*/}
      {/*          </div>*/}
      {/*        )}*/}
      {/*      </FieldGroup>*/}
      {/*    </Fieldset>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </form>
  )
}
