import mongoose, { Schema, Document } from 'mongoose';

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

const outputSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  fields: { type: [this], default: [] },
});

const agentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    agentId: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    modelName: { type: String, required: true },
    modelCategory: { type: String },
    instruction: { type: String, required: true },
    outputStructure: { type: [outputSchema], required: true },
  },
  { timestamps: true }
);

const Agent = mongoose.model<AgentDoc>('Agent', agentSchema);

export default Agent;