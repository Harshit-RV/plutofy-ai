import express from 'express';
import { 
  createNewAgent, 
  getAgentsByUserId, 
  getAgentById, 
  deleteAgent, 
  getAllAgents, 
  updateAgent 
} from '../services/agent.service';
import { AgentDoc, AgentProps } from '../models/Agent.model';
import { getResponse } from '../utils/getAiResponse';

const router = express.Router();


// Create a new agent
router.post('/create', async (req, res) : Promise<any> => {
  try {

    const { name, userId, description, modelName, modelCategory, instruction, outputStructure } = req.body;

    if (!name || !description || !modelName || !modelCategory || !instruction || !outputStructure) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newAgent : AgentProps = {
      userId,
      name,
      description,
      modelName,
      modelCategory,
      instruction,
      outputStructure
    };

    const agentDoc = await createNewAgent(newAgent);

    return res.status(201).json(agentDoc);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Get agents by user ID
// router.get('/list/:userId', async (req, res) : Promise<any> => {

//   const { userId } = req.query.params;
//   // if (!userId) {
//   //   return res.status(403).end();
//   // }

//   const agents = await getAgentsByUserId(userId);

//   return res.json(agents);
// });

// Get agent by ID
router.get('/:id', async (req, res) : Promise<any> => {
  const { id } = req.params;

  const agent = await getAgentById(id);
  if (!agent) {
    return res.status(404).json({ message: 'Agent not found' });
  }
  

  // await getResponse({
  //   fields: agent.outputStructure,
  //   instruction: "You are a security system. Given a name and age, you need to respond whether user can be admin or not. Anyone above 18 can be admin.",
  //   prompt: "name : aayushi, age : 17",
  // });

  return res.json(agent);
});

// Delete an agent
router.post('/delete', async (req, res) : Promise<any> => {

  const { agentId, userId } = req.body;

  if (!agentId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const agent = await getAgentById(agentId);
  if (!agent) {
    return res.status(400).json({ message: 'No agent found' });
  }

  if (agent.userId !== userId) {
    return res.status(403).end();
  }

  await deleteAgent(agentId);

  res.status(200).end();
});

// Get all agents (admin or for specific user)
router.get('/all', async (req, res) : Promise<any> => {
  const agents = await getAllAgents();
  return res.json(agents);
});

// Update an agent
router.post('/update', async (req, res) : Promise<any> => {
  const { agentId, updateFields } = req.body;

  if (!agentId || !updateFields) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const updatedAgent = await updateAgent(agentId, updateFields);

  if (!updatedAgent) {
    return res.status(404).json({ message: 'Agent not found' });
  }

  return res.json(updatedAgent);
});

export default router;