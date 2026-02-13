import {graphql} from "relay-runtime"
import {useLazyLoadQuery} from "react-relay"

export const UsersPage = () => {
  const UsersQuery = graphql`
    query Users {
      users {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `

  const data = useLazyLoadQuery(UsersQuery, {})

  console.log(data)

  return <div>Users</div>
}
