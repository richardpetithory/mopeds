import type {Race} from "@/lib/models/bakers.ts"
import {Link} from "react-router"

export const RaceName = ({race}: {race: Race}) => (
  <Link to={`/bakers/races/${race.id}`}>
    {race.year} - {race.name}
  </Link>
)
