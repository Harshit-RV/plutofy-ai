
import { API_URL } from '@/config';
import { IWebhookProps, WebhookDoc } from '@/types/webhook';
import axios from 'axios';


class WebhookService {
  static baseUrl = `${API_URL}/webhook`

  static createWebhook = async ( data: IWebhookProps, token: string) : Promise<WebhookDoc> => {
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

  static deleteWebhookByWorkflowId = async (workflowId: string, token : string) : Promise<WebhookDoc> => {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/${workflowId}`,
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

export default WebhookService
