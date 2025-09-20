import LlmNode, { AgentNode, ConditionNode, EmailNode, TelegramNode, WebhookTriggerNode } from '@/components/LlmNode';
import { ButtonCN } from '@/components/ui/buttoncn';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import { Background, Connection, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
 
const initialNodes = [
  // { id: '1', position: { x: 0, y: 0 }, data: { label: 'first block' } },
  // { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  // { id: '3', position: { x: 100, y: 0 }, data: { label: 'third block' }, type: 'agentCard', },
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'third block' }, type: 'webhookTriggerNode', },
  { id: '2', position: { x: 100, y: 0 }, data: { label: 'third block' }, type: 'emailNode', },
  { id: '3', position: { x: 100, y: 100 }, data: { label: 'third block' }, type: 'telegramNode', },
  { id: '4', position: { x: 200, y: 100 }, data: { label: 'third block' }, type: 'agentNode', },
  { id: '5', position: { x: 200, y: 200 }, data: { label: 'third block' }, type: 'llmNode', },
  { id: '6', position: { x: 200, y: 300 }, data: { label: 'third block' }, type: 'conditionNode', },
  // { 
  //   id: '4-123213',
  //   position: { x: 0, y: 0 },
  //   data: { 
  //     llm: 'GPT',
  //   }, 
  //   type: 'llmNode',
  // },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 

const nodeTypes = {
  llmNode: LlmNode,
  webhookTriggerNode: WebhookTriggerNode,
  emailNode: EmailNode,
  telegramNode: TelegramNode,
  agentNode: AgentNode,
  conditionNode: ConditionNode,
}

export enum NodeType {
  llmNode = "llmNode",
  webhookTriggerNode = "webhookTriggerNode",
  emailNode = "emailNode",
  telegramNode = "telegramNode",
  agentNode = "agentNode",
  conditionNode = "conditionNode" 
}

const WorkflowBuilder = () => {
  const [ nodes,, onNodesChange ] = useNodesState(initialNodes);
  const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);
  const { getNode } = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) => [...edges, { id: `${connection.source}+${connection.target}`, source: connection.source, target: connection.target }]);
    },
    [setEdges]
  );

  return (
    <div className='relative h-screen w-full p-4 bg-gray-100 pb-20'>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ButtonCN
            className="absolute right-10 top-10 z-10 flex gap-3 border"
            variant="outline"
          >
            <FaPlus /> Add node
          </ButtonCN>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="z-10 bg-white shadow-lg"
          >
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>


      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        isValidConnection={(connection) => {
          const sourceNode = getNode(connection.source);
          const targetNode = getNode(connection.target);

          if (targetNode?.type === NodeType.llmNode) {
            if (sourceNode?.type === NodeType.agentNode) return true;
            return false;
          }

          return true;
        }}
        fitView
        className='rounded-2xl border bg-white'
      > 
        <Background color='#919191' bgColor='#333333'/>
        {/* <Background color='white' bgColor='#F3F4F6'/> */}
         {/* <Controls/>  
          <MiniMap /> */}
      </ReactFlow>
    </div>
  );
}


export default function WorkflowBuilderPage() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder/>
    </ReactFlowProvider>
  )
}