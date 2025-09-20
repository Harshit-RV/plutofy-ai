import { Document } from 'mongoose';
import { Node } from '@xyflow/react';

// export interface INode extends Node {
//   // id: string,
//   // position: { x: number, y: number }, 
//   // data: object, 
//   newtype: string, 
// }

export interface IConnection {
  id: string, 
  source: string, 
  target: string
}

export interface IWorkflow {
  name: string,
  userId: string, // refs to user

  nodes: Node[],
  connections: IConnection[],
}

export type WorkflowProps = Omit<IWorkflow, "userId">

export interface WorkflowDoc extends IWorkflow, Document {
  createdAt: Date,
  updatedAt: Date,
}

export enum NodeType {
  llmNode = "llmNode",
  webhookTriggerNode = "webhookTriggerNode",
  emailNode = "emailNode",
  telegramNode = "telegramNode",
  agentNode = "agentNode",
  conditionNode = "conditionNode" 
}