
import { API_URL } from '@/config';
import { WorkflowDoc, WorkflowProps } from '@/types/workflow';
import axios from 'axios';


class WorkflowService {
  static baseUrl = `${API_URL}/workflow`

  static createWorkflow = async ( data: WorkflowProps, token: string) : Promise<WorkflowDoc> => {
    try {
      const response = await axios.post(
        `${this.baseUrl}/`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  };

  static updateWorkflow = async ( id: string, data: WorkflowProps, token: string) : Promise<WorkflowDoc> => {
    try {
      const response = await axios.put(
        `${this.baseUrl}/${id}`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  };

  static getAllWorkflowsByUser = async (token : string) : Promise<WorkflowDoc[]> => {
    try {
      const response = await axios.get(
        `${this.baseUrl}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching API keys:', error);
      throw error;
    }
  };

  static getWorkflowById = async (id: string, token : string) : Promise<WorkflowDoc> => {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching API keys:', error);
      throw error;
    }
  };

  static deleteWorkflow = async (id: string, token : string) : Promise<WorkflowDoc> => {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching API keys:', error);
      throw error;
    }
  };
}

export default WorkflowService
