import {ApolloProvider} from "@apollo/client/react";
import {StrictMode} from "react";
import {createBrowserRouter, RouterProvider} from "react-router";
import {client} from "./lib/apiClient.ts";
import {UserContextProvider} from "./lib/userContext/UserContextProvider.tsx";
import LoginPage from "./pages/users/LoginPage.tsx";
import {UsersPage} from "./pages/users/UsersPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UsersPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export const App = () => (
  <StrictMode>
    <ApolloProvider client={client}>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </ApolloProvider>
  </StrictMode>
);
