import { Handle, Position } from "@xyflow/react";
import logos from "@/utils/logos";

export const AgentNode = () => {
  return (
    <div className='h-full w-full bg-white text-black border rounded-lg p-3'>
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
