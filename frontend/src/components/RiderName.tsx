import type {Rider} from "@/lib/models/users.ts"
import {Link} from "react-router"

export const RiderName = ({rider}: {rider: Rider}) => <Link to={`/riders/${rider.id}`}>{rider.name}</Link>
