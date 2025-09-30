import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import httpTool from "./tools/http-tool";
import ExecutionHelper from "../../helper";
import { ExecuteWorkflowInput } from "../../types";
import { INode } from "../../../models/Workflow.model";

class AgentService {
  // TODO: ideally use some form of NodeType here
  static tools: Record<string, DynamicStructuredTool> = {
    httpRequestToolNode: httpTool
  }
  
  static getModel = (provider: string, model: string, apiKey: string, temperature = 0) => {
    switch (provider) {
      case "google":
        return new ChatGoogleGenerativeAI({
          model: model,
          apiKey: apiKey,
          temperature: temperature,
        });
    
      default:
        return new ChatGoogleGenerativeAI({
          model: model,
          apiKey: apiKey,
          temperature: temperature,
        });
    }
  }

  static getToolsList = (input: ExecuteWorkflowInput, toolNodes: INode[]) => {
    let toolsList: DynamicStructuredTool[] = []

    toolNodes.forEach((node) => {
      toolsList.push(this.tools[node.type])
    })

    return toolsList;
  }
}

export default AgentService;