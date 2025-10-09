import { OutputStructure } from "../../../models/Agent.model";
import { INode } from "../../../models/Workflow.model";
import ExecutionHelper from "../../helper";

const executeWebhookNode = async (node: INode, previousNodeData: object) : Promise<object> => {
  try {
    const outputStructure = (node.data as any).outputStructure as OutputStructure[];
    const data = ExecutionHelper.getDataFromNode(previousNodeData, outputStructure);
    return data;
  } catch (error) {
    console.log("webhook node execution error: ",error)
    return {};
  }
}

export default executeWebhookNode;