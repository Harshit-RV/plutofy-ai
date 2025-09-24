import { Handle, Position } from "@xyflow/react";
import { GeneralActionNode } from "./shared/NodeWrappers";
import logos from "@/utils/logos";

const TelegramNode = () => {
  // const nodeId = useNodeId();
  // const node = useNodesData(nodeId ?? "");

  return (
    <GeneralActionNode> 
      <img
        src={logos.telegramNode}
        alt="Telegram"
        className="w-6 h-6 object-contain"
      />

      {/* <p>{JSON.stringify(node)}</p> */}

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
