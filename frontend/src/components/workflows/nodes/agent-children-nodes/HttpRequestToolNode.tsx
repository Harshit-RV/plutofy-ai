import { Handle, Position } from "@xyflow/react";
import { GeneralDependentNode } from "../shared/NodeWrappers";
import logos from "@/utils/logos";

const HttpRequestToolNode = () => {
  return (
    <GeneralDependentNode>
      <img
        src={logos.httpRequestToolNode}
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



export default HttpRequestToolNode;