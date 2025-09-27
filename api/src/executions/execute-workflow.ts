import { INode, IWorkflow } from "../models/Workflow.model";
import { NodeType } from "../types";
import executeNode from "./execute-node";
import ExecutionHelper from "./helper";
import { ExecuteWorkflowInput } from "./types";

const exampleWorkflow: IWorkflow = {
  "userId": "user_2sPMSyDXLR0nHVxWYTJbPxxphih",
  "name": "Simple Workflow",
  "connections": [
      {
          "id": "e1-2",
          "source": "1",
          "target": "2",
      },
      {
          "id": "2+telegramNode-0a50b8bd-feec-43e2-a69f-d5253e76d8d0",
          "source": "2",
          "target": "telegramNode-0a50b8bd-feec-43e2-a69f-d5253e76d8d0",
      }
  ],
  "nodes": [
      {
          "id": "1",
          "position": {
              "x": 0,
              "y": 0,
          },
          data: {},
          "type": NodeType.webhookTriggerNode,
      },
      {
          "id": "2",
          "position": {
              "x": 90.18960487395032,
              "y": -0.7809338712437466,
          },
          "data": {
              "html": "<div>html body. proof: <button>this is a button</button></div>",
              "text": "this is example text",
              "subject": "Plutofy Workflows",
              "to": "harshit.rai.verma@gmail.com",
              "from": "Plutos <onboarding@resend.dev>"
          },
          "credentials": "68d6eea1d6f5883ab2d7b3b0",
          "type": NodeType.emailNode,
      },
      {
          "id": "telegramNode-0a50b8bd-feec-43e2-a69f-d5253e76d8d0",
          "position": {
              "x": 179.23584988259282,
              "y": -1.4551609164940018,
          },
          "data": {
              "chatId": "1022231993",
              "message": "this is the message. or is it?"
          },
          "credentials": "68d6e930d6f5883ab2d7afed",
          "type": NodeType.telegramNode,
      }
  ],
}

const executeWorkflow = async (input: ExecuteWorkflowInput) => {
  await executeNode(input);

  const nextNodeId = ExecutionHelper.getNextNodeId(input)

  if (!nextNodeId) {
    console.log("no more nodes to process")
    return;
  }

  executeWorkflow({ ...input, nodeId: nextNodeId})
};


export const executeOnce = async () => {
  await executeWorkflow({
    workflow: exampleWorkflow,
    nodeId: "1",
    userId: "user_2sPMSyDXLR0nHVxWYTJbPxxphih"
  })
}

// export default executeWorkflow;