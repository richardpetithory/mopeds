import {Loading} from "@/components/Loading.tsx"
import {PageHeader} from "@/components/PageHeader/PageHeader.tsx"
import {GQL_RIDER, type RiderResponse} from "@/lib/gql/users.ts"
import {useQuery} from "@apollo/client/react"
import {useParams} from "react-router"

export const RiderPage = () => {
  const {riderId} = useParams()

  const {data} = useQuery<RiderResponse>(GQL_RIDER, {
    variables: {
      id: riderId,
    },
  })

  if (!data) return <Loading />

  return (
    <>
      <PageHeader breadCrumbs={[{label: data.rider.name}]} />
    </>
  )
}
