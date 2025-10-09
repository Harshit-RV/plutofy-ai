import { Handle, Position, useNodeId, useReactFlow } from "@xyflow/react";
import { GeneralActionNode } from "./shared/NodeWrappers";
import logos from "@/utils/logos";
import { INode } from "@/types/workflow";
import WorkflowValidator from "@/utils/workflow-validator.util";
import { useMemo } from "react";

const TelegramNode = () => {
  const nodeId = useNodeId();
  const { getNode } = useReactFlow();

  const node = getNode(nodeId ?? "") as INode | undefined;
  const isCorrectlyConfigured = useMemo(() => node ? WorkflowValidator.isNodeConfigCorrect(node) : false, [node]);

  return (
    <GeneralActionNode className={`border-2 ${isCorrectlyConfigured ? "" : "border-red-500"}`}>
      <img
        src={logos.telegramNode}
        alt="Telegram"
        className="w-6 h-6 object-contain"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="b"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
      />
    </GeneralActionNode>
  )
}

export default TelegramNode;
