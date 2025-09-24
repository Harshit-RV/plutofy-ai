import { Handle, Position } from "@xyflow/react";
import { GeneralDependentNode } from "./shared/NodeWrappers";
import logos from "@/utils/logos";

export const AgentToolNode = () => {
  return (
    <GeneralDependentNode>
      <img
        src={logos.emailNode}
        alt="Agent Tool"
        className="w-6 h-6 object-contain"
      />
      <Handle 
        type="target" 
        position={Position.Top}
      />
    </GeneralDependentNode>
  )
}

export default AgentToolNode;
