import { Field, JsonValue } from "@/components/json-forms/JsonInput";
import { OutputStructure } from "@/types/agent";

class OutputStructureBuilder {
  static getDefaultValue = (type: string): JsonValue => {
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

  static getJsonObjectForPreview = (
    fields: OutputStructure[],
  ): { [key: string]: JsonValue } => {
    return fields.reduce(
      (obj, field) => {
        if (field.name) {
          if (field.type === "object" && field.fields) {
            obj[field.name] = this.getJsonObjectForPreview(field.fields);
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
                ? [this.getJsonObjectForPreview(field.fields[0].fields)]
                : [];
            }
          } else {
            obj[field.name] = this.getDefaultValue(field.type);
          }
        }
        return obj;
      },
      {} as { [key: string]: JsonValue },
    );
  };

  static convertOutputStructureToFields = (outputStructure: OutputStructure[]): Field[] => {
    return outputStructure.map(({ id, name, type, fields }) => ({
      id,
      name,
      type,
      fields: fields ? this.convertOutputStructureToFields(fields) : undefined,
    }));
  };

  static convertFieldsToOutputStructure = (fields: Field[]): OutputStructure[] => {
    return fields.map(({ id, name, type, fields }) => ({
      id,
      name,
      type,
      fields: fields ? this.convertFieldsToOutputStructure(fields) : type == "array" ? [{ id: Date.now().toString(), name: "", type: "string" }] : undefined,
    }));
  };
}


export default OutputStructureBuilder