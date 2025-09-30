import { OutputStructure } from "../../../models/Agent.model";
import { INode } from "../../../models/Workflow.model";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import AgentService from "./agent.service";
import AgentExecutionHelper from "./helper";
import { ExecuteWorkflowInput } from "../../types";
import workflowScheme from "../../../workflow-scheme";

const executeAgentNode = async (input: ExecuteWorkflowInput, node: INode, userId: string, dataStructure: OutputStructure[]) => {
  try {
    // AI Agent node has no credentials, only LLM Node does
    const data = AgentExecutionHelper.getDataFromNode(node.data, dataStructure);

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
    });

    await agent.invoke({
      messages: [
        {
          role: "user",
          content: data.prompt as string,
        },
      ],  
    });
  
  } catch (error) {
    console.log(error)
  }
}

export default executeAgentNode;