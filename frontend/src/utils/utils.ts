import { JsonValue } from "@/components/json-forms/JsonInput";
import { OutputStructure } from "@/types/agent";

function truncateString(str: string, length: number = 50): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

const getDefaultValue = (type: string): JsonValue => {
  switch (type) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object":
      return {};
    default:
      return null;
  }
};

const getJsonObject = (
  fields: OutputStructure[],
): { [key: string]: JsonValue } => {
  return fields.reduce(
    (obj, field) => {
      if (field.name) {
        if (field.type === "object" && field.fields) {
          obj[field.name] = getJsonObject(field.fields);
        } else if (
          field.type === "array" &&
          field.fields &&
          field.fields.length > 0
        ) {
          if (field.fields[0].type === "string") {
            obj[field.name] = ["strings"];
          } else if (field.fields[0].type === "number") {
            obj[field.name] = ["numbers"];
          } else {
            obj[field.name] = field.fields[0].fields
              ? [getJsonObject(field.fields[0].fields)]
              : [];
          }
        } else {
          obj[field.name] = getDefaultValue(field.type);
        }
      }
      return obj;
    },
    {} as { [key: string]: JsonValue },
  );
};

export { truncateString, getJsonObject };
