import type {RaceTeam, Team} from "@/lib/types/bakers.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {useParams} from "react-router"

export interface TeamResponse {
  team: Team
  teamRaces: RaceTeam[]
}

export const GQL_TEAM_SUMMARY = gql`
  query Team($id: String!) {
    team(id: $id) {
      id
      name
      raceteamSet {
        id
        race {
          name
        }
      }
    }
    teamRaces(teamId: $id) {
      team {
        name
      }
      race {
        name
      }
    }
  }
`

export const TeamPage = () => {
  const {id} = useParams()

  const {data, loading} = useQuery<TeamResponse>(GQL_TEAM_SUMMARY, {
    variables: {id},
  })

  if (!data || loading) return null

  return (
    <div>
      <div>
        <div>Name: {data.team.name}</div>
      </div>
      <br />
      <div>
        {data.teamRaces.map((teamRace) => (
          <div>Race: {teamRace.race.name}</div>
        ))}
      </div>
    </div>
  )
}
