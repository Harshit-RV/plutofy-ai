import { OutputStructure } from "../../../models/Agent.model";
import { INode } from "../../../models/Workflow.model";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import AgentService from "./agent.service";
import AgentExecutionHelper from "./helper";
import { ExecuteWorkflowInput } from "../../types";
import workflowScheme from "../../../workflow-scheme";
import { generateDynamicObjectZodSchema } from "../../../utils/generateDynamicZodSchema";

const executeAgentNode = async (input: ExecuteWorkflowInput, node: INode, userId: string, dataStructure: OutputStructure[]) : Promise<object> => {
  try {
    // AI Agent node has no credentials, only LLM Node does
    const data = AgentExecutionHelper.getDataFromNode(node.data, dataStructure);

    // Generate dynamic Zod schema from the output structure defined in the frontend
    const outputStructure = (node.data as any).outputStructure as OutputStructure[];
    const responseSchema = generateDynamicObjectZodSchema(outputStructure);

    if (data.getStructuredResponse as boolean && outputStructure.length == 0) {
      throw Error("No output structure defined")
    }

    // prepare LLM model
    const llmNode = AgentExecutionHelper.getLlmNode(input)

    if (!llmNode.credentials) {
      throw Error("No credentials set. Credentials are important for AI Agent Node execution")
    }
    const llmCredStructure = workflowScheme.nodes.find(item => item.type === llmNode.type)?.credentials ?? [];
    const llmDataStructure = workflowScheme.nodes.find(item => item.type === llmNode.type)?.data ?? [];

    const llmCreds = await AgentExecutionHelper.getCredentials(llmNode.credentials, userId, llmCredStructure)
    const llmData = await AgentExecutionHelper.getDataFromNode(llmNode.data, llmDataStructure)
    const model = AgentService.getModel(llmData.provider as string, llmData.model as string, llmCreds.apiKey as string,);

    // prepare tools list
    const toolNodes = AgentExecutionHelper.getAllToolNodes(input)
    const toolsList = AgentService.getToolsList(input, toolNodes);
    
    const agent = createReactAgent({
      llm: model,
      tools: toolsList,
      responseFormat: data.getStructuredResponse as boolean ? responseSchema : undefined,
    });

    const res = await agent.invoke({
      messages: [
        {
          role: "user",
          content: data.prompt as string,
        },
      ],
    });

    // console.log(data.getStructuredResponse as boolean ? res.structuredResponse : res.messages)
    return data.getStructuredResponse as boolean ? res.structuredResponse : res.messages
  
  } catch (error) {
    console.log(error)
    return {};
  }
}

export default executeAgentNode;