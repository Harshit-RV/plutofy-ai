import { OutputStructure } from "../../../models/Agent.model";
import { INode } from "../../../models/Workflow.model";
import ExecutionHelper from "../../helper";
import TelegramService from "./telegram.service";

const executeTelegramNode = async (node: INode, userId: string, credStructure: OutputStructure[], dataStructure: OutputStructure[]) => {
  try {
    if (!node.credentials) {
      throw Error("No credentials set. Credentials are important for Telegram Node execution")
    }
  
    const creds = await ExecutionHelper.getCredentials(node.credentials, userId, credStructure)
    const data = ExecutionHelper.getDataFromNode(node.data, dataStructure);
  
    await TelegramService.sendMessage({
      botToken: creds.botToken,
      chatId: data.chatId,
      message: data.message,
    })
  
  } catch (error) {
    console.log(error)
  }
}

export default executeTelegramNode;