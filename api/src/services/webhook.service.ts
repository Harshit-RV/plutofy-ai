import WebhookEntity, { IWebhookProps } from "../models/Webhook.model";

class WebhookService {
  static async createWebhook(data: IWebhookProps, userId: string) {
    const webhook =  new WebhookEntity({
      ...data, userId
    })
    return webhook.save();
  }

  static async deleteWebhookByWorkflowId(id: string, userId: string) {
    return await WebhookEntity.findOneAndDelete({ workflowId: id, userId: userId })
  }

  static async getWebhookById(id: string, userId: string) {
    const records = await WebhookEntity.find({ _id: id, userId: userId});
    if (records.length == 0) return null
    return records[0]
  }

  static async getWebhookByWorkflowId(id: string, userId: string) {
    const records = await WebhookEntity.find({ workflowId: id, userId: userId});
    if (records.length == 0) return null
    return records[0]
  }
}

export default WebhookService;