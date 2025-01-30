import express from 'express';
import { 
  createNewAgent, 
  getAgentsByUserId, 
  getAgentById, 
  deleteAgent, 
  getAllAgents, 
  updateAgent, 
  getAgentsByAgentId
} from '../services/agent.service';
import { AgentDoc, AgentProps } from '../models/Agent.model';
import { getResponse } from '../utils/getAiResponse';

const router = express.Router();


// Create a new agent
router.post('/', async (req, res) : Promise<any> => {
  try {
    const { agentId, message } = req.body;

    if (!agentId || !message) {
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

    // const agentDoc = await createNewAgent(newAgent);

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;