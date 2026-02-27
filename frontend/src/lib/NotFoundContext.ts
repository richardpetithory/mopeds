import {createContext} from "react"

interface NotFoundContextValue {
  notFound: boolean | null
  setNotFound: (show: boolean) => void | null
}

export const NotFoundContext = createContext<NotFoundContextValue>({
  notFound: null,
  setNotFound: () => null,
})
