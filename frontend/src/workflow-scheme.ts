type NodeGeneralType =  "llmNode" | "webhookTriggerNode" | "emailNode" | "telegramNode" | "agentNode" | "conditionNode"

interface NodeInfo {
  name: string,
  description: string,
  type: NodeGeneralType,
  category: "trigger" | "action",
  credentials: object
  data: object,
  connections?: {
    required?: NodeGeneralType[]
  }
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
      category: "action",
      credentials: {
        botToken: "string"
      },
      data: [
        { name: "chatId", type: "string" },
        { name: "message", type: "string" },
      ]
    },
    {
      name: "Webhook Trigger",
      description: "Trigger by making a call to Webhook URL",
      type: "webhookTriggerNode",
      category: "trigger",
      credentials: {},
      data: [
        { name: "payload", type: "object" }
      ]
    },
    {
      name: "Email",
      description: "Send an email",
      type: "emailNode",
      category: "action", 
      credentials: {
        smtpServer: "string",
        username: "string",
        password: "string"
      },
      data: [
        { name: "to", type: "string" },
        { name: "subject", type: "string" },
        { name: "body", type: "string" }
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
      category: "action",
      credentials: {},
      data: [
        { name: "goal", type: "string" },
        { name: "tools", type: "array" }
      ],
      connections: {
        required: ["llmNode"]
      }
    },
    {
      name: "Condition",
      description: "Branch workflow based on conditions",
      type: "conditionNode",
      category: "action",
      credentials: {},
      data: [
        { name: "condition", type: "string" },
        { name: "truePathLabel", type: "string" },
        { name: "falsePathLabel", type: "string" }
      ]
    }
  ]
}

export default workflowScheme;