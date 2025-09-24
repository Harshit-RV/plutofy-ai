import { PrimitiveType } from "./types/common-types"

type NodeGeneralType =  "llmNode" | "webhookTriggerNode" | "emailNode" | "telegramNode" | "agentNode" | "conditionNode"

interface NodeInfo {
  name: string,
  description: string,
  image: string,
  type: NodeGeneralType,
  category: "trigger" | "action",
  credentials: object
  data: InputField[],
  connections?: {
    required?: NodeGeneralType[]
  }
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
        { name: "chatId", displayName: "Chat ID", type: "string" },
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
      credentials: {},
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
      credentials: {
        smtpServer: "string",
        username: "string",
        password: "string"
      },
      data: [
        { name: "from", displayName: "From", type: "string"},
        { name: "to", displayName: "To", type: "string" },
        { name: "subject", displayName: "Subject", type: "string" },
        { name: "HTML Body", displayName: "HTML Body", type: "string" }
      ]
    },
    // {
    //   name: "LLM",
    //   description: "Large Language Model node",
    //   type: "llmNode",
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
      credentials: {},
      data: [
        // { name: "goal", type: "string" },
        // { name: "tools", type: "array" }
      ],
      connections: {
        required: ["llmNode"]
      }
    },
    {
      name: "Condition",
      description: "Branch workflow based on conditions",
      type: "conditionNode",
      image: "/condition.svg",
      category: "action",
      credentials: {},
      data: [
        // { name: "condition", type: "string" },
        // { name: "truePathLabel", type: "string" },
        // { name: "falsePathLabel", type: "string" }
      ]
    }
  ]
}

export default workflowScheme;