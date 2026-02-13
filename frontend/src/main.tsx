import {StrictMode, Suspense} from "react"
import {createRoot} from "react-dom/client"
import {createBrowserRouter, RouterProvider} from "react-router"
import "./index.css"
import {UsersPage} from "./pages/users/UsersPage.tsx"
import {RelayEnvironment} from "./relay/RelayEnvironment.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Home</div>,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RelayEnvironment>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </RelayEnvironment>
  </StrictMode>
)
