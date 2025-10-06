import AgentLlmNode from "./nodes/agent-children-nodes/AgentLlmNode";
import HttpRequestToolNode from "./nodes/agent-children-nodes/HttpRequestToolNode";
import AgentNode from "./nodes/AgentNode";
import ConditionNode from "./nodes/ConditionNode";
import EmailNode from "./nodes/EmailNode";
import TelegramNode from "./nodes/TelegramNode";
import WebhookTriggerNode from "./nodes/WebhookTriggerNode";

const nodeTypes = {
  agentLlmNode: AgentLlmNode,
  webhookTriggerNode: WebhookTriggerNode,
  emailNode: EmailNode,
  telegramNode: TelegramNode,
  agentNode: AgentNode,
  conditionNode: ConditionNode,
  httpRequestToolNode: HttpRequestToolNode,
}

export default nodeTypes;
