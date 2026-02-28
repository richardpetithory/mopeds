import {type CurrentRiderInfoResponse, GQL_CURRENT_RIDER_INFO} from "@/lib/gql/users.ts"
import {useQuery} from "@apollo/client/react"

export const CurrentRiderName = () => {
  const {data, loading: loadingRider} = useQuery<CurrentRiderInfoResponse>(GQL_CURRENT_RIDER_INFO)

  if (loadingRider) return null
  if (!data?.currentRider.id) return null

  return <div>{data?.currentRider.name}</div>
}
