import Agent, { AgentDoc, AgentProps } from "../models/Agent.model";
import { v4 as uuidv4 } from 'uuid';

export const createNewAgent = async (args: AgentProps) : Promise<AgentDoc> => {
  
  const agent = new Agent({ ...args, agentId: uuidv4() });
  return agent.save();
}

export const getAgentsByUserId = async (userId: string) : Promise<AgentDoc[]> => {
  return Agent.find({ userId });
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
