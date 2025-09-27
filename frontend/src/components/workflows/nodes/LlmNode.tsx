import { Handle, Position } from "@xyflow/react";
import { FaGoogle } from "react-icons/fa";
import { GeneralDependentNode } from "./shared/NodeWrappers";

const LlmNode = () => {
  return (
    <GeneralDependentNode>
      <FaGoogle />
      <Handle 
        type="target" 
        position={Position.Top}
      />
    </GeneralDependentNode>
  )
}



export default LlmNode;