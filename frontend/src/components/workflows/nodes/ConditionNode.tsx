import { Handle, Position, useNodeId, useReactFlow } from "@xyflow/react";
import { GeneralActionNode } from "./shared/NodeWrappers";
import logos from "@/utils/logos";
import { INode } from "@/types/workflow";
import WorkflowValidator from "@/utils/workflow-validator.util";
import { useMemo } from "react";

export const ConditionNode = () => {
  const nodeId = useNodeId();
  const { getNode } = useReactFlow();

  const isCorrectlyConfigured = useMemo(() => {
    const node = getNode(nodeId ?? "") as INode | undefined;
    return node ? WorkflowValidator.isNodeConfigCorrect(node) : false
  }, [getNode, nodeId]);

  return (
    <GeneralActionNode className={`border-2 ${isCorrectlyConfigured ? "border-green-400" : "border-red-500"}`}>
      <img
        src={logos.conditionNode}
        alt="Condition"
        className="w-6 h-6 object-contain"
      />
      <p className="text-[6px] pt-0.5">if/else</p>
      <div className="handles sources">
        <Handle
          id="1"
          type="source"
          position={Position.Right}
        />
        <Handle
          id="2"
          type="source"
          position={Position.Right}
        />
      </div>
      <Handle
        type="target"
        position={Position.Left}
      />
    </GeneralActionNode>
  )
}

export default ConditionNode;
