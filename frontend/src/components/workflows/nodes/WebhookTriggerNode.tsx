import { Handle, Position } from "@xyflow/react";
import { GeneralTriggerNode } from "./shared/NodeWrappers";
import logos from "@/utils/logos";

export const WebhookTriggerNode = () => {
  return (
    <GeneralTriggerNode>
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
