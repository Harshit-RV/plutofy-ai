
import { API_URL } from '@/config';
import { CredentialsDoc, CredentialsProps } from '@/types/credentials';
import axios from 'axios';


class CredentialsService {
  static baseUrl = `${API_URL}/credentials`

  static createCredentials = async ( data: CredentialsProps, token: string) : Promise<CredentialsDoc> => {
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

  static getAllCredentialsByUser = async (token : string) : Promise<CredentialsDoc[]> => {
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

  static getAllCredentialsByUserAndNodeType = async (nodeType: string, token : string) : Promise<CredentialsDoc[]> => {
    try {
      const response = await axios.get(
        `${this.baseUrl}/?nodeType=${nodeType}`,
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

  static getCredentialsById = async (id: string, token : string) : Promise<CredentialsDoc> => {
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

  static deleteCredentials = async (id: string, token : string) : Promise<CredentialsDoc> => {
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

export default CredentialsService
