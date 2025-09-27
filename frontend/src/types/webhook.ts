import { Document } from "mongoose";

export interface IWebhook {
  userId: string
  nodeId: string,
  workflowId: string,
}

export type IWebhookProps = Omit<IWebhook, "userId">

export interface WebhookDoc extends IWebhook, Document {
  createdAt: Date,
  updatedAt: Date,
}