import mongoose, { Document, Schema } from "mongoose";

export interface IWebhook {
  userId: string
  nodeId: string,
  workflowId: string,
}

export type IWebhookProps = Omit<IWebhook, "userId">

interface WebhookDoc extends IWebhook, Document {
  createdAt: Date,
  updatedAt: Date,
}

const webhookSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    nodeId: { type: String, required: true, unique: true },
    workflowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflows', required: true },
  },
  { timestamps: true }
);

const WebhookEntity = mongoose.model<WebhookDoc>('Webhooks', webhookSchema);

export default WebhookEntity;