"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agent_service_1 = require("../services/agent.service");
const getAiResponse_1 = require("../utils/getAiResponse");
const router = express_1.default.Router();
// Create a new agent
router.post('/', async (req, res) => {
    try {
        const { agentId, message } = req.body;
        if (!agentId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const agent = await (0, agent_service_1.getAgentsByAgentId)(agentId);
        if (agent == null) {
            return res.status(400).json({ error: "Agent not found. Please recheck your Agent ID" });
        }
        const response = await (0, getAiResponse_1.getResponse)({
            fields: agent.outputStructure,
            instruction: agent.instruction,
            prompt: message,
        });
        // const agentDoc = await createNewAgent(newAgent);
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.default = router;
