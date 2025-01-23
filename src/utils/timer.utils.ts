import axios from "axios";
import { TimerDoc } from "../types/timer";

export const getTimer = async (token: string): Promise<TimerDoc> => {
  const res = await axios.get('https://wt-server.onrender.com/timer/get', {
      headers: {
          Authorization: `Bearer ${token}`
      }
  })
  return res.data;
}