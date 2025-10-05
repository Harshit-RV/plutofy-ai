import { IWorkflow } from "../models/Workflow.model";

export interface ExecuteWorkflowInput {
  workflow: IWorkflow;
  nodeId: string;
  userId: string
}

export interface ExecuteWorkflowHistory {
  nodeId: string;
  data: object;
}