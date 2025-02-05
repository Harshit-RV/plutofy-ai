import LlmNode, { AgentNode } from '@/components/LlmNode';
import { Background, Connection, Controls, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'first block' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  { id: '3', position: { x: 100, y: 0 }, data: { label: 'third block' }, type: 'agentCard', },
  { 
    id: '4-123213',
    position: { x: 0, y: 0 },
    data: { 
      llm: 'GPT',
    }, 
    type: 'llmNode',
  },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 

const nodeTypes = {
  llmNode: LlmNode,
  agentCard: AgentNode,
}

export default function WorkflowBuilder() {
  const [ nodes, setNodes, onNodesChange ] = useNodesState(initialNodes);
  const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) => [...edges, { id: `${connection.source}+${connection.target}`, source: connection.source, target: connection.target }]);
    },
    [setEdges]
  );

  return (
    <div className='h-screen w-full p-10 bg-gray-100 pb-20'>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className='rounded-2xl border bg-white'
      > 
        <Background />
         {/* <Controls/>   */}
        {/* <MiniMap /> */}
      </ReactFlow>
    </div>
  );
}

