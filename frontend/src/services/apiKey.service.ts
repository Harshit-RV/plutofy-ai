import { API_URL } from '@/config';
import { ApiKeyDoc } from '@/types/apiKey';
import axios from 'axios';

class ApiKeyService {
  /**
   * Function to create a new API key
   * @param name - The name of the API key
   * @param access - Access level for the API key
   * @param token - The authentication token for the request
   * @returns - The created API key (only visible at creation)
   */
  static createApiKey = async ({ name, access = "ALL", token } : { name: string, access?: string, token: string}) : Promise<ApiKeyDoc> => {
    try {
      const response = await axios.post(
        `${API_URL}/apikey/create`,
        { name, access },
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

  /**
   * Function to get API keys for the authenticated user
   * @param token - The authentication token for the request
   * @returns - List of API keys (without the actual key)
   */
  static getApiKeys = async (token : string) : Promise<ApiKeyDoc[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/apikey/list`,
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

  /**
   * Function to delete an API key
   * @param apiKeyId - The ID of the API key to be deleted
   * @param token - The authentication token for the request
   */
  static deleteApiKey = async ({ apiKeyId, token } : { apiKeyId: string, token: string}) => {
    try {
      await axios.post(
        `${API_URL}/apikey/delete`,
        { apiKeyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error('Error deleting API key:', error);
      throw error;
    }
  };

}

export default ApiKeyService;