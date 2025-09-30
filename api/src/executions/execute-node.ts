import { NodeType } from "../types";
import workflowScheme from "../workflow-scheme";
import ExecutionHelper from "./helper";
import executeAgentNode from "./nodes/agent/executeAgentNode";
import executeEmailNode from "./nodes/email/executeEmailNode";
import executeTelegramNode from "./nodes/telegram/executeTelegramNode";
import { ExecuteWorkflowInput } from "./types";

const executeNode = async (input: ExecuteWorkflowInput) => {
  const node = ExecutionHelper.getNodeFromId(input)
  const credStructure = workflowScheme.nodes.find(item => item.type === node?.type)?.credentials ?? [];
  const dataStructure = workflowScheme.nodes.find(item => item.type === node?.type)?.data ?? [];

  if (!node) return

  switch (node.type) {
    case NodeType.emailNode:
      await executeEmailNode(node, input.userId, credStructure, dataStructure)
      break;

    case NodeType.telegramNode:
      await executeTelegramNode(node, input.userId, credStructure, dataStructure)
      break;

    case NodeType.agentNode:
      await executeAgentNode(input, node, input.userId, dataStructure)
      break;

    // TODO: implement execution logic
    default:
      console.log("Execution unimplemented for node type ", node.type)
      break;
  }
}

export default executeNode;