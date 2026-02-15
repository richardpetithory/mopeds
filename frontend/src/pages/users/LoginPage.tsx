import {gql} from "@apollo/client";
import {useMutation} from "@apollo/client/react";
import {useState} from "react";

type TokenAuthResponse = {
  tokenAuth: {
    token: string;
  };
};

const LOGIN_MUTATION = gql`
  mutation TokenAuth($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
    }
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, {loading, error}] = useMutation<TokenAuthResponse>(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data} = await login({variables: {email, password}});
      if (data && data.tokenAuth && data.tokenAuth.token) {
        sessionStorage.setItem("token", data.tokenAuth.token);
        // Optionally redirect or update UI here
      }
    } catch {
      // Error handling
    }
  };
  //
  // const {
  //   handleSubmit,
  //   formState: {errors},
  //   register,
  //   setError,
  // } = useForm<CancelSubscriptionFormValues>({
  //   resolver: yupResolver<CancelSubscriptionFormValues>(CancelSubscriptionFormSchema),
  // });

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        Login
      </button>
      {error && <div style={{color: "red"}}>Login failed</div>}
    </form>
  );
};

export default LoginPage;
