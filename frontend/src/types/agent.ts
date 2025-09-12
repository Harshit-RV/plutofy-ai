import { Document } from 'mongoose';

export interface OutputStructure {
  id: string;
  name: string;
  type: string;
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