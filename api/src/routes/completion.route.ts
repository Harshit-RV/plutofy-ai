import express, { Request, Response } from 'express';
import {
  getAgentsByAgentId
} from '../services/agent.service';
import { AgentDoc, AgentProps } from '../models/Agent.model';
import { getResponse } from '../utils/getAiResponse';
import { isSecretKeyValid } from '../services/apiKey.service';
import { requireAuth } from '@clerk/express';

const router = express.Router();

export const getAuthToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

// make request to an agent
router.post('/', async (req: Request, res: Response) : Promise<any> => {
  try {

    res.status(503).set("Retry-After", "172800")
      .json({
        status: "unavailable",
        message:
          "Managed AI Agents are temporarily disabled. Please Workflows in the meantime at https://plutofy.harshitrv.com/workflow."
      });

    return;

    
    // const token = getAuthToken(req);

    // if (!token) {
    //   return res.status(401).json({ message: 'Unauthorized: Missing API Key' });
    // }

    // if (!await isSecretKeyValid(token)) {
    //   return res.status(403).json({ message: 'INVALID_API_KEY' });
    // }

    // const { agentId, message } = req.body;

    // if (!agentId) {
    //   return res.status(400).json({error: "Missing required fields"})
    // }

    // const agent = await getAgentsByAgentId(agentId)
    
    // if (agent == null) {
    //   return res.status(400).json({error: "Agent not found. Please recheck your Agent ID"})
    // }

    // const response = await getResponse({
    //   fields: agent.outputStructure,
    //   instruction: agent.instruction,
    //   prompt: message,
    // });

    // if (!response) return res.status(500).json({error: "no response from Agent"});

    // return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.use(requireAuth())

router.post('/from-dashboard', async (req: Request, res: Response) : Promise<any> => {
  try {
    const { agentId, message } = req.body;

    if (!agentId) {
      return res.status(400).json({error: "Missing required fields"})
    }

    const agent = await getAgentsByAgentId(agentId)
    
    if (agent == null) {
      return res.status(400).json({error: "Agent not found. Please recheck your Agent ID"})
    }

    const response = await getResponse({
      fields: agent.outputStructure,
      instruction: agent.instruction,
      prompt: message,
    });

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export default router;