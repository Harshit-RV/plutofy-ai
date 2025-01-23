import React, { useState } from "react";
import { z } from "zod";

// Types for dynamic fields
interface Field {
  name: string;
  type: "string" | "number" | "boolean";
  constraints?: Record<string, any>;
}

const ZodSchemaBuilder: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [schemaPreview, setSchemaPreview] = useState<string>("");

  // Add a new field
  const addField = () => {
    setFields([
      ...fields,
      { name: "", type: "string", constraints: {} },
    ]);
  };

  // Update a field
  const updateField = (index: number, updatedField: Partial<Field>) => {
    const newFields = fields.map((field, i) =>
      i === index ? { ...field, ...updatedField } : field
    );
    setFields(newFields);
    generateSchema(newFields);
  };

  // Remove a field
  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    generateSchema(newFields);
  };

  // Generate Zod schema
  const generateSchema = (fields: Field[]) => {
    const schemaObject: Record<string, any> = {};

    fields.forEach(({ name, type, constraints }) => {
      let fieldSchema: any;
      switch (type) {
        case "string":
          fieldSchema = z.string();
          if (constraints?.minLength) {
            fieldSchema = fieldSchema.min(constraints.minLength);
          }
          if (constraints?.maxLength) {
            fieldSchema = fieldSchema.max(constraints.maxLength);
          }
          break;
        case "number":
          fieldSchema = z.number();
          if (constraints?.min) {
            fieldSchema = fieldSchema.min(constraints.min);
          }
          if (constraints?.max) {
            fieldSchema = fieldSchema.max(constraints.max);
          }
          break;
        case "boolean":
          fieldSchema = z.boolean();
          break;
        default:
          fieldSchema = z.any();
      }
      schemaObject[name] = fieldSchema;
    });

    const schema = z.object(schemaObject);
    setSchemaPreview(schema.toString());
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Zod Schema Builder</h1>

      <button onClick={addField}>Add Field</button>

      <div style={{ marginTop: "20px" }}>
        {fields.map((field, index) => (
          <div key={index} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
            <label>
              Field Name:
              <input
                type="text"
                value={field.name}
                onChange={(e) => updateField(index, { name: e.target.value })}
              />
            </label>

            <label>
              Type:
              <select
                value={field.type}
                onChange={(e) => updateField(index, { type: e.target.value as Field["type"] })}
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
            </label>

            {field.type === "string" && (
              <div>
                <label>
                  Min Length:
                  <input
                    type="number"
                    onChange={(e) =>
                      updateField(index, {
                        constraints: {
                          ...field.constraints,
                          minLength: parseInt(e.target.value, 10) || undefined,
                        },
                      })
                    }
                  />
                </label>
                <label>
                  Max Length:
                  <input
                    type="number"
                    onChange={(e) =>
                      updateField(index, {
                        constraints: {
                          ...field.constraints,
                          maxLength: parseInt(e.target.value, 10) || undefined,
                        },
                      })
                    }
                  />
                </label>
              </div>
            )}

            {field.type === "number" && (
              <div>
                <label>
                  Min:
                  <input
                    type="number"
                    onChange={(e) =>
                      updateField(index, {
                        constraints: {
                          ...field.constraints,
                          min: parseFloat(e.target.value) || undefined,
                        },
                      })
                    }
                  />
                </label>
                <label>
                  Max:
                  <input
                    type="number"
                    onChange={(e) =>
                      updateField(index, {
                        constraints: {
                          ...field.constraints,
                          max: parseFloat(e.target.value) || undefined,
                        },
                      })
                    }
                  />
                </label>
              </div>
            )}

            <button onClick={() => removeField(index)}>Remove Field</button>
          </div>
        ))}
      </div>

      <h2>Generated Schema</h2>
      <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>{schemaPreview}</pre>
    </div>
  );
};

export default ZodSchemaBuilder;
