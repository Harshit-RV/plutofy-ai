import { Handle, Position } from "@xyflow/react";
import { GeneralDependentNode } from "../shared/NodeWrappers";
import logos from "@/utils/logos";

const AgentLlmNode = () => {
  return (
    <GeneralDependentNode>
      <img
        src={logos.agentLlmNode}
        alt="llm"
        className="size-4 object-contain"
      />
      <Handle 
        type="target" 
        position={Position.Top}
      />
    </GeneralDependentNode>
  )
}



export default AgentLlmNode;