import { Handle, Position, useNodeId, useNodesData } from "@xyflow/react";
import { GeneralActionNode } from "./shared/NodeWrappers";
import logos from "@/utils/logos";

const TelegramNode = () => {
  const nodeId = useNodeId();
  const node = useNodesData(nodeId ?? "");
  
  return (
    <GeneralActionNode className="border-red-500 border-2"> 
      <img
        src={logos.telegramNode}
        alt="Telegram"
        className="w-6 h-6 object-contain"
      />

      <p>{JSON.stringify(node)}</p>

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
