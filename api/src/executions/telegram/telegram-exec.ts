import axios from "axios"
import { SendMessageProps } from "./types";

class TelegramExec {
  static sendMessage = async (data: SendMessageProps) => {
    await axios.post(`https://api.telegram.org/bot${data.apiKey}/sendMessage`, {
        chat_id: data.chatId,
        text: data.text
    })
  } 
}

export default TelegramExec;