import { PrimitiveType } from "./types/common-types"

type NodeGeneralType =  "agentLlmNode" | "webhookTriggerNode" | "emailNode" | "telegramNode" | "agentNode" | "conditionNode" | "httpRequestToolNode"

export interface NodeInfo {
  name: string,
  description: string,
  image: string,
  type: NodeGeneralType,
  category: "trigger" | "action" | "child",
  credentials: InputField[],
  data: InputField[],
  // connections?: {
  //   required?: NodeGeneralType[]
  // }
}

export interface InputField {
  name: string,
  displayName: string,
  type: PrimitiveType,
} 

interface WorkflowScheme { 
  nodes: NodeInfo[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const workflowScheme: WorkflowScheme  = {
  nodes: [
    {
      name: "Telegram DM",
      description: "Send a message on Telegram",
      type: "telegramNode", 
      image: "/telegram.svg",
      category: "action",
      credentials: [
        { name: "botToken", displayName: "Bot Token", type: "string" },
      ],
      data: [
        { name: "chatId", displayName: "Chat ID", type: "string" },
        { name: "message", displayName: "Message", type: "string" },
      ]
    },
    {
      name: "Webhook Trigger",
      description: "Trigger by making a call to Webhook URL",
      type: "webhookTriggerNode",
      image: "/webhook.svg",
      category: "trigger",
      credentials: [],
      data: [
        { displayName:"", name: "Payload", type: "object" }
      ]
    },
    {
      name: "Email",
      description: "Send an email",
      type: "emailNode",
      image: "/mail.svg",
      category: "action", 
      credentials: [
        { name: "smtpServer", displayName: "SMTP Server", type: "string" },
        { name: "port", displayName: "Port", type: "number" },
        { name: "username", displayName: "Username", type: "string" },
        { name: "password", displayName: "Password", type: "string" },
      ],
      data:[
        { name: "from", displayName: "From", type: "string"},
        { name: "to", displayName: "To", type: "string" },
        { name: "subject", displayName: "Subject", type: "string" },
        { name: "html", displayName: "HTML Body", type: "string" },
      ]
    },
    {
      name: "LLM",
      image: "/llm.svg",
      description: "Large Language Model node",
      type: "agentLlmNode",
      category: "child",
      credentials: [
        { name: "apiKey", displayName: "API Key", type: "string" },
      ],
      data: [
        { name: "provider", displayName: "Provider", type: "string"},
        { name: "model", displayName: "Model", type: "string"},
      ]
    },
    {
      name: "HTTP Request Tool",
      image: "/globe.svg",
      description: "Gives Agent ability to make GET requests",
      type: "httpRequestToolNode",
      category: "child",
      credentials: [],
      data: []
    },
    {
      name: "AI Agent",
      description: "An AI agent that can use tools and make decisions",
      type: "agentNode",
      image: "/bot.svg",
      category: "action",
      credentials: [],
      data: [
        { name: "prompt", displayName: "System Prompt", type: "string"},
      ],
      // connections: {
      //   required: ["agentLlmNode"]
      // },
    },
    // {
    //   name: "Condition",
    //   description: "Branch workflow based on conditions",
    //   type: "conditionNode",
    //   image: "/condition.svg",
    //   category: "action",
    //   credentials: [],
    //   data: []
    // }
  ]
}

export default workflowScheme;