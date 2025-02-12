import { z, ZodObject, ZodRawShape, ZodSchema } from "zod";
import { OutputStructure } from "../models/Agent.model";

/**
 * Function to generate a Zod schema dynamically
 * @param fields - Array of field definitions
 * @returns - A Zod schema object
 */
export function generateDynamicZodSchema(fields: OutputStructure[]): ZodObject<ZodRawShape> {
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
          throw new Error(`Field of type "array" must have subfields defined`);
        }
        let arraySchema = generateDynamicZodSchema(field.fields);
        schema = z.array(arraySchema);
        break;

      case "object":
        // Recursively generate schema for nested objects
        if (!field.fields || field.fields.length === 0) {
          throw new Error(`Field of type "object" must have subfields defined`);
        }
        schema = generateDynamicZodSchema(field.fields); // Recursion for nested object
        break;

      default:
        throw new Error(`Unsupported field type: ${field.type}`);
    }

    schemaShape[field.name] = schema;
  });

  return z.object(schemaShape);
}