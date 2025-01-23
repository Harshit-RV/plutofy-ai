
import { Document } from 'mongoose';

export interface MonitorProps {
  monitorUrl: string,
  alertCondition: AlertCondition,
  email: string,
}

export interface MonitorDoc extends Document {
  userId: string,
  monitorUrl: string,
  interval: number,
  lastChecked: Date,
  createdAt: Date,
  updatedAt: Date,
  status: boolean,
  alertCondition: AlertCondition,
  contacts: ContactDoc[],
}

export interface ContactProps {
  priorityOrder: number,
  email: string,
}

export interface CreateMonitorProps extends MonitorProps {
  token: string;
}

export interface ContactDoc extends Document {
  priorityOrder: number,
  email: string,
  createdAt: Date,
  updatedAt: Date,
}

export type AlertCondition = 'IS501' | 'ISUNAVAILABLE' | 'IS404' | 'IS500' | 'ISNOT200';
