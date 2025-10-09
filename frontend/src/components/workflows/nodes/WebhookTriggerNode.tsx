import { Handle, Position, useNodeId, useReactFlow } from "@xyflow/react";
import { GeneralTriggerNode } from "./shared/NodeWrappers";
import logos from "@/utils/logos";
import WorkflowValidator from "@/utils/workflow-validator.util";
import { INode } from "@/types/workflow";
import { useMemo } from "react";

export const WebhookTriggerNode = () => {
  const nodeId = useNodeId();
  const { getNode } = useReactFlow();

  const node = getNode(nodeId ?? "") as INode | undefined;
  const isCorrectlyConfigured = useMemo(() => node ? WorkflowValidator.isNodeConfigCorrect(node) : false, [node]);

  return (
    <GeneralTriggerNode className={`border-2 ${isCorrectlyConfigured ? "0" : "border-red-500"}`}>
      <div className="flex pl-2 flex-col w-full items-center">
        <img
          src={logos.webhookTriggerNode}
          alt="Webhook"
          className="w-6 h-6 object-contain"
        />
        <p className="text-[6px] mx-0">Webhook</p>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="b"
      />
    </GeneralTriggerNode>
  )
}

export default WebhookTriggerNode;
