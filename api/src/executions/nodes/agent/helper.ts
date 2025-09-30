import { INode } from "../../../models/Workflow.model";
import ExecutionHelper from "../../helper"
import { ExecuteWorkflowInput } from "../../types";

class AgentExecutionHelper extends ExecutionHelper {

  static getAllToolNodes = (input: ExecuteWorkflowInput) : INode[] => {
    const ids = input.workflow.connections
      .filter(item => {
        return (item.source === input.nodeId && item.type == "child" && item.sourceHandle == "tool")
      })
      .map(item => item.target);

    return ids.map((item) => {
      return this.getNodeFromId({
        workflow: input.workflow,
        nodeId: item,
        userId: input.userId
      });
    }).filter((node) => node != undefined)
  };

  static getLlmNode = (input: ExecuteWorkflowInput) => {
    const id = input.workflow.connections.find(item => {
      return (item.source === input.nodeId && item.type == "child" && item.sourceHandle == "llm")
    })?.target;

    if (!id) throw Error("AI Agent node execution failed: No associated LLM node found.")

    const node = this.getNodeFromId({
      workflow: input.workflow,
      nodeId: id,
      userId: input.userId,
    })

    if (!node) throw Error("AI Agent node execution failed: No associated LLM node found.")
    
    return node;
  }
}

export default AgentExecutionHelper;