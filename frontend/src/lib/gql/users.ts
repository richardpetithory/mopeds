import type {Rider} from "@/lib/models/users.ts"
import {gql} from "@apollo/client"

export const GQL_CURRENT_RIDER_INFO = gql`
  query CurrentRiderInfo {
    currentRider {
      id
      name
      email
      dateJoined
      isActive
      isStaff
      isSuperuser
      lastLogin
    }
  }
`

export interface CurrentRiderInfoResponse {
  currentRider: Rider
}

// ----------------------------------------------------------------------------

export const GQL_RIDERS = gql`
  query Rider($nameSearch: String!, $excludeIds: [String]) {
    riders(nameSearch: $nameSearch, excludeIds: $excludeIds) {
      id
      name
    }
  }
`

export interface RidersResponse {
  riders: Rider[]
}

// ----------------------------------------------------------------------------

export const GQL_RIDER = gql`
  query Rider($id: String!) {
    rider(id: $id) {
      id
      name
    }
  }
`

export interface RiderResponse {
  rider: Rider
}

// ----------------------------------------------------------------------------
