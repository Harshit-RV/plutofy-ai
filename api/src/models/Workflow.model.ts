import mongoose, { Schema } from "mongoose";


export interface INode {
  id: string,
  position: { x: number, y: number }, 
  data: object, 
  type: NodeType, 
}

export interface IConnection {
  id: string, 
  source: string, 
  target: string
}

export interface IWorkflow {
  name: string,
  userId: string, // refs to user

  nodes: INode[],
  connections: IConnection[],
}

export type WorkflowProps = Omit<IWorkflow, "userId">

interface WorkflowDoc extends IWorkflow, Document {
  created_at: Date,
  updated_at: Date,
}

export enum NodeType {
  llmNode = "llmNode",
  webhookTriggerNode = "webhookTriggerNode",
  emailNode = "emailNode",
  telegramNode = "telegramNode",
  agentNode = "agentNode",
  conditionNode = "conditionNode" 
}

const nodeSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    
    position: { type: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    }, required: true },

    data: { type: Object, required: true, default: {} },

    type: { type: String, required: true },
  },
);

const connectionSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
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