import axios from "axios"
import { SendMessageProps } from "./types";

class TelegramService {
  static sendMessage = async (data: SendMessageProps) => {
    await axios.post(`https://api.telegram.org/bot${data.botToken}/sendMessage`, {
        chat_id: data.chatId,
        text: data.message
    })
  } 
}

export default TelegramService;