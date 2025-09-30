import mongoose, { Document, Schema } from "mongoose";
import { NodeType } from "../types";

export interface INode {
  id: string,
  position: { x: number, y: number }, 
  data: object, 
  credentials?: string, // refs to credentials
  type: NodeType, 
}

export interface IConnection {
  id: string, 
  source: string, 
  target: string,
  type?: string,
  sourceHandle?: string
}

export interface IWorkflow {
  name: string,
  userId: string, // refs to user

  nodes: INode[],
  connections: IConnection[],
}

export type WorkflowProps = Omit<IWorkflow, "userId">

export interface WorkflowDoc extends IWorkflow, Document {
  createdAt: Date,
  updatedAt: Date,
}

const nodeSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    
    position: { type: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    }, required: true },

    data: { type: Object, required: true, default: {} },

    credentials: { type: mongoose.Schema.Types.ObjectId, ref: 'Credentials', required: false },

    type: { type: String, required: true, enum: Object.values(NodeType) },
  },
);

const connectionSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    sourceHandle: { type: String, required: false },
    type: { type: String, required: false }
  },
);

const workflowSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    connections: { type: [connectionSchema] },
    nodes: { type: [nodeSchema] },
  },
  { timestamps: true }
);

const WorkflowEntity = mongoose.model<WorkflowDoc>('Workflows', workflowSchema);

export default WorkflowEntity;