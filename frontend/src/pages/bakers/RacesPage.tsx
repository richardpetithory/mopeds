import type {Race} from "@/lib/types/bakers.ts"
import {useUserContext} from "@/lib/userContext/userContext.ts"
import {gql} from "@apollo/client"
import {useQuery} from "@apollo/client/react"
import {Button} from "@mantine/core"
import {Link} from "react-router"
// import {Button} from "@catalyst/button.tsx"
// import {Heading} from "@catalyst/heading.tsx"
// import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@catalyst/table.tsx"

export interface RacesResponse {
  races: Race[]
}

export const GQL_RACES_LIST = gql`
  query Races($offset: Int, $limit: Int) {
    races(offset: $offset, limit: $limit) {
      id
      year
      name
    }
  }
`

export const RacesPage = () => {
  const {currentUser} = useUserContext()

  const {data, loading} = useQuery<RacesResponse>(GQL_RACES_LIST)

  if (!data || loading) return null

  return (
    <>
      <div className="flex flex-row">
        <div className={"shadow-primary mr-auto"}>Races</div>
        {currentUser?.isStaff && (
          <div>
            <Link to={`/bakers/races/new`}>
              <Button>New</Button>
            </Link>
          </div>
        )}
      </div>
      {/*<Table>*/}
      {/*  <TableHead>*/}
      {/*    <TableRow>*/}
      {/*      <TableHeader>Name</TableHeader>*/}
      {/*      <TableHeader>Year</TableHeader>*/}
      {/*    </TableRow>*/}
      {/*  </TableHead>*/}
      {/*  <TableBody>*/}
      {/*    {data.races.map((race) => (*/}
      {/*      <TableRow key={race.id}>*/}
      {/*        <TableCell className="font-medium">*/}
      {/*          <Link to={`${race.id}`}>{race.name}</Link>*/}
      {/*        </TableCell>*/}
      {/*        <TableCell>{race.year}</TableCell>*/}
      {/*      </TableRow>*/}
      {/*    ))}*/}
      {/*  </TableBody>*/}
      {/*</Table>*/}
    </>
  )
}
