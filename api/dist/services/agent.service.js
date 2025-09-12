"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAgent = exports.getAllAgents = exports.deleteAgent = exports.getAgentById = exports.getAgentsByAgentId = exports.getAgentsByUserId = exports.createNewAgent = void 0;
const Agent_model_1 = __importDefault(require("../models/Agent.model"));
const uuid_1 = require("uuid");
const createNewAgent = async (args) => {
    const agent = new Agent_model_1.default({ ...args, agentId: (0, uuid_1.v4)() });
    return agent.save();
};
exports.createNewAgent = createNewAgent;
const getAgentsByUserId = async (userId) => {
    return Agent_model_1.default.find({ userId });
};
exports.getAgentsByUserId = getAgentsByUserId;
const getAgentsByAgentId = async (agentId) => {
    return Agent_model_1.default.findOne({ agentId });
};
exports.getAgentsByAgentId = getAgentsByAgentId;
const getAgentById = async (id) => {
    return Agent_model_1.default.findById(id);
};
exports.getAgentById = getAgentById;
const deleteAgent = async (id) => {
    return Agent_model_1.default.findByIdAndDelete(id);
};
exports.deleteAgent = deleteAgent;
const getAllAgents = async () => {
    return Agent_model_1.default.find({});
};
exports.getAllAgents = getAllAgents;
const updateAgent = async (id, updateFields) => {
    return Agent_model_1.default.findByIdAndUpdate(id, updateFields, { new: true });
};
exports.updateAgent = updateAgent;
