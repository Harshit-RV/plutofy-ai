import mongoose, { Schema, Document } from 'mongoose';

export type PrimitiveType = "string" | "number" | "boolean" | "object" | "array";


export interface OutputStructure {
  id: string;
  name: string;
  displayName?: string;
  type: PrimitiveType;
  fields?: OutputStructure[];
}

export interface Agent {
  name: string;
  userId: string;
  description: string;
  modelName: string;
  modelCategory: string;
  instruction: string;
  outputStructure: OutputStructure[];
}

// mongoose doc
export interface AgentDoc extends Agent, Document {
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AgentProps = Agent;

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