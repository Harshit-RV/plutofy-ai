"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDynamicZodSchema = generateDynamicZodSchema;
const zod_1 = require("zod");
/**
 * Function to generate a Zod schema dynamically
 * @param fields - Array of field definitions
 * @returns - A Zod schema object
 */
function generateDynamicZodSchema(fields) {
    const schemaShape = {};
    fields.forEach((field) => {
        let schema;
        switch (field.type) {
            case "string":
                schema = zod_1.z.string();
                break;
            case "number":
                schema = zod_1.z.number();
                break;
            case "boolean":
                schema = zod_1.z.boolean();
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
    return zod_1.z.object(schemaShape);
}
