import { NodeType } from "@/types/workflow";

const logos: Record<NodeType, string> = {
  [NodeType.telegramNode]: "/telegram.svg",
  [NodeType.agentNode]: "/bot.svg",
  [NodeType.conditionNode]: "/condition.svg",
  [NodeType.emailNode]: "/mail.svg",
  [NodeType.llmNode]: "/telegram.svg",
  [NodeType.webhookTriggerNode]: "/webhook.svg",
}

export default logos;