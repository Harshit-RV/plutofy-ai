import { Handle, Position } from "@xyflow/react";
import { GeneralActionNode } from "./shared/NodeWrappers";
import logos from "@/utils/logos";

const EmailNode = () => {
  // const nodeId = useNodeId();
  // const node = useNodesData(nodeId ?? "");

  return (
    <GeneralActionNode>
      <img
        src={logos.emailNode}
        alt="Email"
        className="w-6 h-6 object-contain"
      />
      {/* <p>{JSON.stringify(node)}</p> */}
      <Handle
        type="target"
        position={Position.Left}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </GeneralActionNode>
  )
}

export default EmailNode;