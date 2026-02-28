import type {ErrorLike} from "@apollo/client"
import {Alert, Button, Group} from "@mantine/core"

interface FormFooterProps {
  buttonTitle: string
  awaitingMutation: boolean
  error?: ErrorLike | null
  form: {
    isDirty: () => boolean
    isValid: () => boolean
  }
}

export const FormFooter = ({buttonTitle, awaitingMutation, error, form}: FormFooterProps) => {
  return (
    <>
      <Group>
        <Button type={"submit"} disabled={awaitingMutation || !(form.isDirty() && form.isValid())}>
          {buttonTitle}
        </Button>
      </Group>
      {error?.message && error?.message !== "NONE" && (
        <Alert variant={"filled"} color={"red"} className={"fit-content"}>
          {error?.message}
        </Alert>
      )}
    </>
  )
}
