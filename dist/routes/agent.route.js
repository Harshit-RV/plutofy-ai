"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agent_service_1 = require("../services/agent.service");
const mongoose_1 = require("mongoose");
const express_2 = require("@clerk/express");
const router = express_1.default.Router();
router.use((0, express_2.requireAuth)());
// Create a new agent
router.post('/create', async (req, res) => {
    try {
        const { userId } = (0, express_2.getAuth)(req);
        if (!userId) {
            return res.status(401).end();
        }
        const { name, description, modelName, modelCategory, instruction, outputStructure } = req.body;
        if (!name || !description || !modelName || !instruction || !outputStructure) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const newAgent = {
            userId,
            name,
            description,
            modelName,
            modelCategory,
            instruction,
            outputStructure
        };
        const agentDoc = await (0, agent_service_1.createNewAgent)(newAgent);
        return res.status(201).json(agentDoc);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});
// Get agents by user ID
router.get('/list/user', async (req, res) => {
    try {
        const { userId } = (0, express_2.getAuth)(req);
        if (!userId) {
            return res.status(401).end();
        }
        const agents = await (0, agent_service_1.getAgentsByUserId)(userId);
        return res.json(agents);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});
// Get all agents (admin or for specific user)
router.get('/all', async (req, res) => {
    const agents = await (0, agent_service_1.getAllAgents)();
    return res.json(agents);
});
// Get agent by ID
router.get('/:id', async (req, res) => {
    try {
        const { userId } = (0, express_2.getAuth)(req);
        if (!userId) {
            return res.status(401).end();
        }
        const { id } = req.params;
        const isValidId = (0, mongoose_1.isValidObjectId)(id);
        if (!isValidId) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        const agent = await (0, agent_service_1.getAgentById)(id);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        if (agent.userId !== userId) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        return res.json(agent);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});
// Delete an agent
router.post('/delete', async (req, res) => {
    try {
        const { userId } = (0, express_2.getAuth)(req);
        if (!userId) {
            return res.status(401).end();
        }
        const { agentId } = req.body;
        if (!agentId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const isValidId = (0, mongoose_1.isValidObjectId)(agentId);
        if (!isValidId) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        const agent = await (0, agent_service_1.getAgentById)(agentId);
        if (agent?.userId !== userId) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        if (!agent) {
            return res.status(404).json({ message: 'No agent found' });
        }
        await (0, agent_service_1.deleteAgent)(agentId);
        res.status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});
// Update an agent
router.post('/update', async (req, res) => {
    const { agentId, updateFields } = req.body;
    const { userId } = (0, express_2.getAuth)(req);
    if (!userId) {
        return res.status(401).end();
    }
    if (!agentId || !updateFields) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const agent = await (0, agent_service_1.getAgentById)(agentId);
    if (agent?.userId !== userId) {
        return res.status(404).json({ message: 'Agent not found' });
    }
    const updatedAgent = await (0, agent_service_1.updateAgent)(agentId, updateFields);
    if (!updatedAgent) {
        return res.status(404).json({ message: 'Agent not found' });
    }
    return res.json(updatedAgent);
});
exports.default = router;
