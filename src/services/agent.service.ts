import Agent, { AgentDoc, AgentProps } from "../models/Agent.model";
import crypto from 'crypto';

const generateSecureApiKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const createNewAgent = async (args: AgentProps) : Promise<AgentDoc> => {
  
  const agent = new Agent({ ...args, agentId: generateSecureApiKey() });
  return agent.save();
}

export const getAgentsByUserId = async (userId: string) : Promise<AgentDoc[]> => {
  return Agent.find({ userId });
}

export const getAgentsByAgentId = async (agentId: string) : Promise<AgentDoc | null> => {
  return Agent.findOne({ agentId });
}

export const getAgentById = async (id: string) : Promise<AgentDoc | null> => {
  return Agent.findById(id);
}

export const deleteAgent = async (id: string) => {
  return Agent.findByIdAndDelete(id);
}

export const getAllAgents = async () : Promise<AgentDoc[]> => {
  return Agent.find({});
}

export const updateAgent = async (id: string, updateFields: Partial<AgentProps>) => {
  return Agent.findByIdAndUpdate(id, updateFields, { new: true });
}
