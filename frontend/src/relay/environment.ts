import type {FetchFunction, IEnvironment} from "relay-runtime"
import {Environment, Network, Observable, RecordSource, Store} from "relay-runtime"

const apiFetch: FetchFunction = (params, variables) => {
  const response = fetch("http://localhost:8000/graphql", {
    method: "POST",
    headers: [["Content-Type", "application/json"]],
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  })

  return Observable.from(response.then((data) => data.json()))
}

export const createEnvironment = (): IEnvironment => {
  const network = Network.create(apiFetch)
  const store = new Store(new RecordSource())
  return new Environment({store, network})
}
