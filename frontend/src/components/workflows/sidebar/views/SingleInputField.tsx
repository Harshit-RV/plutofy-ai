import { Input } from "@/components/ui/input"
import { InputField } from "@/workflow-scheme"
import { ReactNode } from "react"

type InputValue = string | number | boolean | object | unknown[];

interface InputFieldProps extends InputField {
  value: InputValue,
  onValueChange: (value: InputValue) => void
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
        value={typeof props.value === 'number' ? props.value : ''} 
        onChange={(e) => props.onValueChange(Number(e.target.value))}
        className=''
      />
    )
  }

  if (props.type === "boolean") {
    return (
      <input
        type="checkbox"
        checked={Boolean(props.value)}
        onChange={(e) => props.onValueChange(e.target.checked)}
        className=''
      />
    )
  }

  if (props.type === "object") {
    const displayValue = typeof props.value === 'string' 
      ? props.value 
      : JSON.stringify(props.value, null, 2);
    
    return (
      <textarea
        value={displayValue}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            props.onValueChange(parsed);
          } catch {
            // Keep the string value if parsing fails, so user can continue editing
            props.onValueChange(e.target.value);
          }
        }}
        className=''
      />
    )
  }

  if (props.type === "array") {
    const displayValue = typeof props.value === 'string' 
      ? props.value 
      : JSON.stringify(props.value, null, 2);
    
    return (
      <textarea 
        value={displayValue}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            props.onValueChange(parsed);
          } catch {
            // Keep the string value if parsing fails, so user can continue editing
            props.onValueChange(e.target.value);
          }
        }}
        className=''
      />
    )
  }

  return null
}

export default SingleInputField;