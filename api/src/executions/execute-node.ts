import { NodeType } from "../types";
import workflowScheme from "../workflow-scheme";
import ExecutionHelper from "./helper";
import executeAgentNode from "./nodes/agent/executeAgentNode";
import executeEmailNode from "./nodes/email/executeEmailNode";
import executeTelegramNode from "./nodes/telegram/executeTelegramNode";
import executeWebhookNode from "./nodes/webhook/executeWebhookNode";
import { ExecuteWorkflowHistory, ExecuteWorkflowInput } from "./types";

const executeNode = async (input: ExecuteWorkflowInput, previousNodeData: ExecuteWorkflowHistory) : Promise<object> => {
  const node = ExecutionHelper.getNodeFromId(input)
  const credStructure = workflowScheme.nodes.find(item => item.type === node?.type)?.credentials ?? [];
  const dataStructure = workflowScheme.nodes.find(item => item.type === node?.type)?.data ?? [];

  if (!node) return {};

  switch (node.type) {
    // email node and telegram node return empty object
    case NodeType.emailNode:
      await executeEmailNode(node, input.userId, credStructure, dataStructure, previousNodeData.data)
      return {};

    case NodeType.telegramNode:
      await executeTelegramNode(node, input.userId, credStructure, dataStructure, previousNodeData.data)
      return {};

    case NodeType.agentNode:
      const agentRes = await executeAgentNode(input, node, input.userId, dataStructure, previousNodeData.data)
      return agentRes;

    case NodeType.webhookTriggerNode:
      const webhookRes = await executeWebhookNode(node, previousNodeData.data);
      return webhookRes;
    
      // TODO: implement execution logic
    default:
      console.log("Execution unimplemented for node type ", node.type)
      return {};
  }
}

export default executeNode;