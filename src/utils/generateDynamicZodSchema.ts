import { z, ZodArray, ZodObject, ZodRawShape, ZodSchema, ZodTypeAny } from "zod";
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
export function generateDynamicObjectZodSchema(fields: OutputStructure[]): ZodObject<ZodRawShape> {
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
        schema = generateDynamicArrayZodSchema(field.fields[0]);
        break;

      case "object":
        // Recursively generate schema for nested objects
        if (!field.fields || field.fields.length === 0) {
          throw new Error(`Field of type "object" must have fields defined`);
        }
        schema = generateDynamicObjectZodSchema(field.fields); // Recursion for nested object
        break;

      default:
        throw new Error(`Unsupported field type: ${field.type}`);
    }

    schemaShape[field.name] = schema;
  });

  return z.object(schemaShape);
}


export function generateDynamicArrayZodSchema(field: OutputStructure): ZodArray<ZodTypeAny> {
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
      return z.array(generateDynamicArrayZodSchema(field.fields[0]));

    case "object":
      // Recursively generate schema for nested objects
      if (!field.fields || field.fields.length === 0) {
        throw new Error(`Field of type "object" must have fields defined`);
      }
      return z.array(generateDynamicObjectZodSchema(field.fields)); // Recursion for nested object

    default:
      throw new Error(`Unsupported field type: ${field.type}`);
}
}
