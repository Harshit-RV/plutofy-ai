import axios from 'axios';
import { AgentDoc, AgentProps } from '../types/agent';

const API_URL = "https://api.plutofy.live"

/**
 * Function to create a new agent
 * @param agentProps - The properties of the agent to be created
 * @param token - The authentication token for the request
 * @returns - The created agent
 */
export const createAgent = async ( {agentProps, token} :{agentProps: Omit<AgentProps, 'userId'>, token: string}): Promise<AgentDoc> => {
  try {
    console.log(`${API_URL}/agent/create`)
    const response = await axios.post(
      `${API_URL}/agent/create`, 
      {
        name: agentProps.name,
        description: agentProps.description,
        modelName: agentProps.modelName,
        modelCategory: agentProps.modelCategory,
        instruction: agentProps.instruction,
        outputStructure: agentProps.outputStructure,
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.log('Error creating agent:', error);
    throw error;
  }
};

/**
 * Function to get agents by user ID
 * @param userId - The user ID to filter agents by
 * @param token - The authentication token for the request
 * @returns - List of agents for the given user
 */
export const getAgentsByUserId = async (token: string): Promise<AgentDoc[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/agent/list/user`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting agents:', error);
    throw error;
  }
};

/**
 * Function to get an agent by its ID
 * @param agentId - The ID of the agent
 * @param token - The authentication token for the request
 * @returns - The agent details
 */
export const getAgentByDocId = async ( { agentDocId, token }:{ agentDocId: string, token: string }): Promise<AgentDoc> => {
  try {
    const response = await axios.get(
      `${API_URL}/agent/${agentDocId}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting agent by ID:', error);
    throw error;
  }
};

/**
 * Function to delete an agent
 * @param agentId - The ID of the agent to be deleted
 * @param userId - The ID of the user performing the deletion
 * @param token - The authentication token for the request
 */
export const deleteAgent = async ( { agentId, token } : {agentId: string, token: string}) => {
  try {
    await axios.post(
      `${API_URL}/agent/delete`, 
      {
        agentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error deleting agent:', error);
    throw error;
  }
};

/**
 * Function to get all agents (admin or for specific user)
 * @param token - The authentication token for the request
 * @returns - List of all agents
 */
export const getAllAgents = async (token: string): Promise<AgentDoc[]> => {
  try {
    console.log(`${API_URL}/agent/all`)
    const response = await axios.get(
      `${API_URL}/agent/all`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error getting all agents:', error);
    throw error;
  }
};

/**
 * Function to update an agent
 * @param agentId - The ID of the agent to be updated
 * @param updateFields - The fields to be updated in the agent
 * @param token - The authentication token for the request
 * @returns - The updated agent
 */
export const updateAgent = async (agentId: string, updateFields: Partial<AgentProps>, token: string): Promise<AgentDoc> => {
  try {
    const response = await axios.post(
      `${API_URL}/agent/update`,
      {
        agentId,
        updateFields,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating agent:', error);
    throw error;
  }
};

interface CompletionResponse {
  completion: JSON;
  statusCode: number;
}

export const getCompletion = async <T>(body: T, token: string): Promise<CompletionResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}/v1/completion`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return {
      completion: response.data,
      statusCode: response.status,
    };
  } catch (error) {
    console.log(`Error getting completion:`, error);
    throw error;
  }
};