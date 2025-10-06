import { Handle, Position, useNodeId, useReactFlow } from "@xyflow/react";
import { GeneralActionNode } from "./shared/NodeWrappers";
import logos from "@/utils/logos";
import { useMemo } from "react";
import WorkflowValidator from "@/utils/workflow-validator.util";
import { INode } from "@/types/workflow";

const EmailNode = () => {
  const nodeId = useNodeId();
  const { getNode } = useReactFlow();

  const isCorrectlyConfigured = useMemo(() => {
    const node = getNode(nodeId ?? "") as INode | undefined;
    return node ? WorkflowValidator.isNodeConfigCorrect(node) : false
  }, [getNode, nodeId]);

  return (
    <GeneralActionNode className={`border-2 ${isCorrectlyConfigured ? "border-green-400" : "border-red-500"}`}>
      <img
        src={logos.emailNode}
        alt="Email"
        className="w-6 h-6 object-contain"
      />
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