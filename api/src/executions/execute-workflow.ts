import executeNode from "./execute-node";
import ExecutionHelper from "./helper";
import { ExecuteWorkflowHistory, ExecuteWorkflowInput } from "./types";

const executeWorkflow = async (input: ExecuteWorkflowInput, history: ExecuteWorkflowHistory[]) => {
  const data = await executeNode(input, history[history.length - 1]);
  history.push({ nodeId: input.nodeId, data });

  const nextNodeId = ExecutionHelper.getNextNodesId(input)

  if (!nextNodeId) {
    console.log("no more nodes to process")
    return;
  }

  nextNodeId.map(async (node) => {
    await executeWorkflow({ ...input, nodeId: node}, history)
  }) 
};

export default executeWorkflow;