import { OutputStructure } from "../models/Agent.model";
import CredentialsService from "../services/credentials.service";
import { generateDynamicObjectZodSchema } from "../utils/generateDynamicZodSchema";
import { ExecuteWorkflowInput } from "./types";

class ExecutionHelper {
  static getNextNodeId = (input: ExecuteWorkflowInput) => {
    return input.workflow.connections.find(item => item.source === input.nodeId)?.target;
  };

  static getNodeFromId = (input: ExecuteWorkflowInput) => {
    return input.workflow.nodes.find(item => item.id === input.nodeId);
  }

  static getDataFromNode = (data: object, structure: OutputStructure[]) => {
    const dynamicSchema = generateDynamicObjectZodSchema(structure)
    
    const parsedData = dynamicSchema.parse(data);
    return parsedData;
  }

  static getCredentials = async (id: string, userId: string, structure: OutputStructure[]) => {
    const creds = await CredentialsService.getCredentialsById(id, userId);
    
    if (creds.length == 0) {
      throw Error("No credentials found")
    }
    
    const dynamicSchema = generateDynamicObjectZodSchema(structure)
    const parsedCreds = dynamicSchema.parse(creds[0].data);
    return parsedCreds;
  }
}

export default ExecutionHelper;