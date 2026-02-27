import {CombinedGraphQLErrors, type ErrorLike} from "@apollo/client"
import {mapValues} from "lodash"

export default function parseDjangoErrors(error: ErrorLike): Record<string, string> {
  if (CombinedGraphQLErrors.is(error)) {
    return mapValues(
      (error.errors.map(({extensions}) => extensions) || [])[0] as unknown as Record<string, string[]>,
      (value) => value.join(",")
    )
  }

  return {}
}
