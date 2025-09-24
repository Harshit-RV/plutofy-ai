import { Handle, Position } from "@xyflow/react";
import { GeneralActionNode } from "./shared/NodeWrappers";
import logos from "@/utils/logos";

export const ConditionNode = () => {
  return (
    <GeneralActionNode>
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
