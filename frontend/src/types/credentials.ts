import { NodeType } from "./workflow";
import { Document } from 'mongoose';

export interface ICredentials {
  userId: string,
  data: object,
  name: string,
  type: NodeType,
}

export type CredentialsProps = Omit<ICredentials, "userId">

export interface CredentialsDoc extends ICredentials, Document {
  createdAt: Date,
  updatedAt: Date,
}
