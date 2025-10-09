import { Handle, Position, useNodeId, useReactFlow } from "@xyflow/react";
import { GeneralDependentNode } from "../shared/NodeWrappers";
import logos from "@/utils/logos";
import { INode } from "@/types/workflow";
import WorkflowValidator from "@/utils/workflow-validator.util";
import { useMemo } from "react";

const AgentLlmNode = () => {
  const nodeId = useNodeId();
  const { getNode } = useReactFlow();

  const node = getNode(nodeId ?? "") as INode | undefined;
  const isCorrectlyConfigured = useMemo(() => node ? WorkflowValidator.isNodeConfigCorrect(node) : false, [node]);

  return (
    <GeneralDependentNode className={`border-2 ${isCorrectlyConfigured ? "" : "border-red-500"}`}>
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