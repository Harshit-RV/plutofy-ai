import { Document } from 'mongoose';
import { Node } from '@xyflow/react';

export type SidebarMode = "ADD-NODE" | "NODE-EXPANDED" | "CLOSED"
export interface SidebarState {
  mode: SidebarMode,
  selectedNodes: Node[]
}
export interface INode extends Node {
  credentials?: string 
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
  description?: string,

  nodes: INode[],
  connections: IConnection[],
}

export type WorkflowProps = Omit<IWorkflow, "userId">

export interface WorkflowDoc extends IWorkflow, Document {
  createdAt: Date,
  updatedAt: Date,
}

export enum NodeType {
  agentLlmNode = "agentLlmNode",
  webhookTriggerNode = "webhookTriggerNode",
  emailNode = "emailNode",
  telegramNode = "telegramNode",
  agentNode = "agentNode",
  conditionNode = "conditionNode",
  httpRequestToolNode = "httpRequestToolNode"
}