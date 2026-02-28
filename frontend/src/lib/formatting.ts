import {format, parse} from "date-fns"

const DATE_FORMAT = "MMM dd, yyyy"
const TIME_FORMAT = "hh:mm aaa"

export const formatTimeString = (time: string): string => format(parse(time, "HH:mm:ss", new Date()), TIME_FORMAT)

export const formatDatetime = (time: Date): string => format(time, `${DATE_FORMAT} @ ${TIME_FORMAT}`)

export const formatFilename = (filename: string): string => {
  return window.location.port === "5173" ? `http://localhost:8000/static/${filename}` : `/static/${filename}`
}
