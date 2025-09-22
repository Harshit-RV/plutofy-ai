import { Input } from "@/components/ui/input"
import { InputField } from "@/workflow-scheme"
import { ReactNode } from "react"

interface InputFieldProps extends InputField {
  value: string,
  onValueChange: (value: string) => void
}

const SingleInputField = ( props : InputFieldProps): ReactNode => {
  if (props.type === "string") {
    return (
      <Input 
        value={props.value as string}
        onChange={(e) => props.onValueChange(e.target.value)}
        className=''
      />
    )
  }

  if (props.type === "number") {
    return (
      <Input
        type="number"
        value={Number(props.value)} 
        onChange={(e) => props.onValueChange(e.target.value)}
        className=''
      />
    )
  }

  if (props.type === "boolean") {
    return (
      <input
        type="checkbox"
        checked={Boolean(props.value)}
        onChange={(e) => props.onValueChange(String(e.target.checked))}
        className=''
      />
    )
  }

  if (props.type === "object") {
    return (
      <textarea
        value={JSON.stringify(props.value, null, 2)}
        onChange={(e) => {
          try {
            props.onValueChange(JSON.parse(e.target.value))
          } catch (err) {
            console.log(err)
          }
        }}
        className=''
      />
    )
  }

  if (props.type === "array") {
    return (
      <textarea 
        value={JSON.stringify(props.value, null, 2)}
        onChange={(e) => {
          try {
            props.onValueChange(JSON.parse(e.target.value))
          } catch (err) {
            console.log(err)
          }
        }}
        className=''
      />
    )
  }

  return null
}

export default SingleInputField;