import { z, ZodArray, ZodObject, ZodRawShape, ZodSchema, ZodTypeAny } from "zod3";
import { OutputStructure } from "../models/Agent.model";

/**
 * Function to generate a Zod schema dynamically
 * @param fields - Array of field definitions
 * @returns - A Zod schema object
 */
/**
 * Function to generate a Zod schema dynamically
 * @param fields - Array of field definitions
 * @returns - A Zod schema object
 */
export function generateDynamicObjectZodV3Schema(fields: OutputStructure[]): ZodObject<ZodRawShape> {
  const schemaShape: ZodRawShape = {};

  fields.forEach((field) => {
    let schema: ZodSchema<any>;

    switch (field.type) {
      case "string":
        schema = z.string();
        break;

      case "number":
        schema = z.number();
        break;

      case "boolean":
        schema = z.boolean();
        break;

      case "array":
        if (!field.fields || field.fields.length === 0) {
          throw new Error(`Field of type "array" must have fields defined`);
        }
        schema = generateDynamicArrayZodV3Schema(field.fields[0]);
        break;

      case "object":
        // Recursively generate schema for nested objects
        if (!field.fields || field.fields.length === 0) {
          throw new Error(`Field of type "object" must have fields defined`);
        }
        schema = generateDynamicObjectZodV3Schema(field.fields); // Recursion for nested object
        break;

      default:
        throw new Error(`Unsupported field type: ${field.type}`);
    }

    schemaShape[field.name] = schema;
    // console.log(schemaShape)
  });

  return z.object(schemaShape);
}


export function generateDynamicArrayZodV3Schema(field: OutputStructure): ZodArray<ZodTypeAny> {
  switch (field.type) {
    case "string":
      return z.array(z.string());

    case "number":
      return z.array(z.number());

    case "boolean":
      return z.array(z.boolean());

    case "array":
      if (!field.fields || field.fields.length === 0) {
        throw new Error(`Field of type "array" must have fields defined`);
      }
      return z.array(generateDynamicArrayZodV3Schema(field.fields[0]));

    case "object":
      // Recursively generate schema for nested objects
      if (!field.fields || field.fields.length === 0) {
        throw new Error(`Field of type "object" must have fields defined`);
      }
      return z.array(generateDynamicObjectZodV3Schema(field.fields)); // Recursion for nested object

    default:
      throw new Error(`Unsupported field type: ${field.type}`);
}
}
