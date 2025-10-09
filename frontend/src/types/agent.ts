import { Document } from 'mongoose';


export type PrimitiveType = "string" | "number" | "boolean" | "object" | "array";
export interface OutputStructure {
  id: string;
  name: string;
  type: PrimitiveType;
  fields?: OutputStructure[];
}

export interface AgentProps {
  name: string;
  userId: string;
  description: string;
  modelName: string;
  modelCategory: string;
  instruction: string;
  outputStructure: OutputStructure[];
}

export interface AgentDoc extends Document {
  _id: string;
  name: string;
  userId: string;
  agentId: string;
  description: string;
  modelName: string;
  modelCategory: string;
  instruction: string;
  outputStructure: OutputStructure[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CompletionResponse {
  completion: JSON | null;
  statusCode: number;
}
