import type {Team} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {useParams} from "react-router"

export interface TeamResponse {
  team: Team
}

export const GQL_TEAM_SUMMARY = gql`
  query Team($pk: String!) {
    team(pk: $pk) {
      id
      name
      raceteamSet {
        id
        race {
          name
        }
      }
    }
  }
`

export const TeamPage = () => {
  const {pk} = useParams()

  const {data, loading} = useQuery<TeamResponse>(GQL_TEAM_SUMMARY, {
    variables: {
      pk: pk,
    },
  })

  if (!data || loading) return null

  const team = data.team

  return (
    <div>
      <div>Name: {team.name}</div>
    </div>
  )
}
