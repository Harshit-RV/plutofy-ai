import { OutputStructure } from "@/types/agent";
import { Field, JsonValue } from "./JsonInput"
import convertOutputStructureToFields from "@/utils/convertOutputStructureToFields";
import { cn } from "@/lib/utils";


const JsonPreview = ({ outputStructure, className } : { outputStructure: OutputStructure[], className?: string }) => {

  const fields = (convertOutputStructureToFields(outputStructure))

  const getJsonObject = (fields: Field[]): { [key: string]: JsonValue } => {
    return fields.reduce(
      (obj, field) => {
        if (field.name) {
          if ((field.type === "object" || field.type === "array") && field.fields) {
            obj[field.name] = getJsonObject(field.fields)
          } else {
            obj[field.name] = getDefaultValue(field.type)
          }
        }
        return obj
      },
      {} as { [key: string]: JsonValue },
    )
  }

  const getDefaultValue = (type: string): JsonValue => {
    switch (type) {
      case "string":
        return ""
      case "number":
        return 0
      case "boolean":
        return false
      case "object":
        return {}
      case "array":
        return []
      default:
        return null
    }
  }

  const jsonObject = getJsonObject(fields)

  return (
    <div className={cn(className)}>
      <pre className="bg-gray-100 dark:bg-background border p-4 text-sm rounded-md overflow-auto">{JSON.stringify(jsonObject, null, 2)}</pre>
    </div>
  )
}

export default JsonPreview;