import { Document } from 'mongoose';

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