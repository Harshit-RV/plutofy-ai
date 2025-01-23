import axios from "axios";
import { CreateMonitorProps, MonitorDoc } from "../types/monitor";

export const createMonitor = async (args: CreateMonitorProps) => {
  try {
      await axios.post('https://wt-server.onrender.com/monitor/create', {
          monitorUrl: args.monitorUrl,
          alertCondition: args.alertCondition,
          email: args.email,
      }, {
          headers: {
              Authorization: `Bearer ${args.token}`
          }
      })
  } catch (error) {
      console.log(error);
  }
}

export const deleteMonitor = async ( { monitorId, token } : { monitorId: string, token: string}) => {
    try {
        await axios.post('https://wt-server.onrender.com/monitor/delete', {
            monitorId: monitorId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        console.log(error);
    }
  }

export const getList = async (token: string): Promise<MonitorDoc[]> => {
    const res = await axios.get('https://wt-server.onrender.com/monitor/list', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data;
}

export const postFeedback = async (rating: number, feedback: string, token: string) => {
    try {
        await axios.post('https://wt-server.onrender.com/feedback', {
            feedback: feedback,
            rating: rating
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        console.log(error);
    }
  }

export const extractDomainForDisplay = (url: string): string => {
    const protocolRegex = /^https?:\/\//;

    return url.replace(protocolRegex, '');
}