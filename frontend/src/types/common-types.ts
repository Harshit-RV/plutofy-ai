
export type PrimitiveType = "string" | "number" | "boolean" | "object" | "array";


export interface OutputStructure {
  id: string;
  name: string;
  type: PrimitiveType;
  fields?: OutputStructure[];
}
