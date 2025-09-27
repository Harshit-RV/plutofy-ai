import executeNode from "./execute-node";
import ExecutionHelper from "./helper";
import { ExecuteWorkflowInput } from "./types";

const executeWorkflow = async (input: ExecuteWorkflowInput) => {
  await executeNode(input);

  const nextNodeId = ExecutionHelper.getNextNodeId(input)

  if (!nextNodeId) {
    console.log("no more nodes to process")
    return;
  }

  await executeWorkflow({ ...input, nodeId: nextNodeId})
};

export default executeWorkflow;