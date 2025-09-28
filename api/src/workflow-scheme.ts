import { OutputStructure, PrimitiveType } from "./models/Agent.model"

type NodeGeneralType =  "agentLlmNode" | "webhookTriggerNode" | "emailNode" | "telegramNode" | "agentNode" | "conditionNode"

interface NodeInfo {
  name: string,
  description: string,
  image: string,
  type: NodeGeneralType,
  category: "trigger" | "action",
  credentials: OutputStructure[],
  data: OutputStructure[],
  connections?: {
    required?: NodeGeneralType[]
  }
}

// export interface InputField {
//   name: string,
//   displayName: string,
//   type: PrimitiveType,
// } 

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
        { id: "1", name: "botToken", displayName: "Bot Token", type: "string" },
      ],
      data: [
        { id: "1",name: "chatId", displayName: "Chat ID", type: "string" },
        { id: "2",name: "message", displayName: "Message", type: "string" },
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
        { id: "1", displayName:"", name: "Payload", type: "object" }
      ]
    },
    {
      name: "Email",
      description: "Send an email",
      type: "emailNode",
      image: "/mail.svg",
      category: "action", 
      credentials: [
        { id: "1", name: "smtpServer", displayName: "SMTP Server", type: "string" },
        { id: "2", name: "port", displayName: "Port", type: "number" },
        { id: "3", name: "username", displayName: "Username", type: "string" },
        { id: "4", name: "password", displayName: "Password", type: "string" },
      ],
      data: [
        { id: "1", name: "from", displayName: "From", type: "string"},
        { id: "2", name: "to", displayName: "To", type: "string" },
        { id: "3", name: "subject", displayName: "Subject", type: "string" },
        { id: "4", name: "html", displayName: "HTML Body", type: "string" },
      ]
    },
    // {
    //   name: "LLM",
    //   description: "Large Language Model node",
    //   type: "agentLlmNode",
    //   category: "action",
    //   credentials: {
    //     apiKey: "string"
    //   },
    //   data: [
    //     { name: "prompt", type: "string" },
    //     { name: "temperature", type: "number" },
    //     { name: "maxTokens", type: "number" }
    //   ]
    // },
    {
      name: "AI Agent",
      description: "An AI agent that can use tools and make decisions",
      type: "agentNode",
      image: "/bot.svg",
      category: "action",
      credentials: [],
      data: [
        // { name: "goal", type: "string" },
        // { name: "tools", type: "array" }
      ],
      connections: {
        required: ["agentLlmNode"]
      }
    },
    {
      name: "Condition",
      description: "Branch workflow based on conditions",
      type: "conditionNode",
      image: "/condition.svg",
      category: "action",
      credentials: [],
      data: [
        // { name: "condition", type: "string" },
        // { name: "truePathLabel", type: "string" },
        // { name: "falsePathLabel", type: "string" }
      ]
    }
  ]
}

export default workflowScheme;