import mongoose, { Schema, Document } from 'mongoose';

export interface ApiKeyProps {
  userId: string;
  name: string;
  access?: string;
}

export interface ApiKeyDoc extends Document {
  userId: string;
  secretKey: string;
  name: string;
  access: string;
  createdAt: Date;
  updatedAt: Date;
}

const apiKeySchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    secretKey: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    access: { type: String, default: 'ALL' },
  },
  { timestamps: true }
);

const ApiKey = mongoose.model<ApiKeyDoc>('ApiKey', apiKeySchema);

export default ApiKey;
