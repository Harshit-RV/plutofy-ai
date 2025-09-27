import mongoose, { Document, Schema } from "mongoose";
import { NodeType } from "../types";

export interface ICredentials {
  userId: string,
  data: object,
  name: string,
  type: NodeType,
}

export type CredentialsProps = Omit<ICredentials, "userId">

interface CredentialsDoc extends ICredentials, Document {
  createdAt: Date,
  updatedAt: Date,
}

const credentialsSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    data: { type: Object, required: true, default: {} },
    type: { type: String, required: true, enum: Object.values(NodeType) },
  },
  { timestamps: true }
);

const CredentialsEntity = mongoose.model<CredentialsDoc>('Credentials', credentialsSchema);

export default CredentialsEntity;