import { Handle, Position, useNodeId, useReactFlow } from "@xyflow/react";
import logos from "@/utils/logos";
import { INode } from "@/types/workflow";
import WorkflowValidator from "@/utils/workflow-validator.util";
import { useMemo } from "react";
// import workflowScheme from "@/workflow-scheme";

export const AgentNode = () => {
  const nodeId = useNodeId();
  const { getNode } = useReactFlow();

  const node = getNode(nodeId ?? "") as INode | undefined;
  const isCorrectlyConfigured = useMemo(() => node ? WorkflowValidator.isNodeConfigCorrect(node) : false, [node]);
  
  return (
    <div className={'h-full w-full bg-white text-black border rounded-lg p-3 ' + (isCorrectlyConfigured ? ' border-2 border-green-500 ' : 'border-2 border-red-500 ')}>
      <Handle type="target" position={Position.Left}/>
      
      <div className="flex gap-2 items-center">
        <img
          src={logos.agentNode}
          alt="Agent"
          className="w-6 h-6 object-contain"
        />
        <p className="text-[10px]">AI Agent</p>
      </div>

      <Handle type="source" position={Position.Bottom} id="llm" style={{ left: 25 }} />
      <Handle type="source" position={Position.Bottom} id="tool" style={{ left: 80 }} />
      {/* <Handle type="source" position={Position.Bottom} id="memory"/> */}
      
      <Handle
        type="source"
        position={Position.Right}
        id="next"
      />
    </div>
  )
}

export default AgentNode;
