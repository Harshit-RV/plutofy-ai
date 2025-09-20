import LlmNode, { AgentNode, ConditionNode, EmailNode, TelegramNode, WebhookTriggerNode } from '@/components/LlmNode';
import { ButtonCN } from '@/components/ui/buttoncn';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import WorkflowService from '@/utils/workflow.util';
import { useAuth } from '@clerk/clerk-react';
import { Background, Connection, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react";
import { IConnection } from '@/types/workflow';
 
// const initialNodes: Node[] = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: 'third block' }, type: 'webhookTriggerNode', },
//   { id: '2', position: { x: 100, y: 0 }, data: { label: 'third block' }, type: 'emailNode', },
//   { id: '3', position: { x: 100, y: 100 }, data: { label: 'third block' }, type: 'telegramNode', },
//   { id: '4', position: { x: 200, y: 100 }, data: { label: 'third block' }, type: 'agentNode', },
//   { id: '5', position: { x: 200, y: 200 }, data: { label: 'third block' }, type: 'llmNode', },
//   { id: '6', position: { x: 200, y: 300 }, data: { label: 'third block' }, type: 'conditionNode', },
// ];
// const initialEdges: IConnection[] = [{ id: 'e1-2', source: '1', target: '2' }];
 

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
type Mode = 'CREATE' | 'EDIT';

const WorkflowBuilder = ({ initialEdges, initialNodes, syncWorkflowWithDB } : { mode: Mode, initialEdges: IConnection[], initialNodes: Node[], syncWorkflowWithDB: () => void }) => {
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

      <Input className='absolute w-min left-10 top-10 z-10' >
      
      </Input>

      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={(changes) => {onNodesChange(changes); syncWorkflowWithDB()}} 
        onEdgesChange={(changes) => {onEdgesChange(changes); syncWorkflowWithDB()}} 
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


export default function WorkflowBuilderPage({ mode } : { mode: Mode }) {
  const { workflowDocId } = useParams(); 
  const { getToken } = useAuth();

  const fetchWorkflow = async () => {
    const token = await getToken();
    if (!token) return;
    if (!workflowDocId) return;
    await new Promise((r) =>  setTimeout(r, 4000))
    return await WorkflowService.getWorkflowById(workflowDocId, token);
  };

  const syncWorkflowWithDB = async () => {
    const token = await getToken();
    if (!token) return;
    if (!workflow) return;
    await WorkflowService.updateWorkflow(String(workflow._id), {
      ...workflow,
      nodes: workflow.nodes || [],
      connections: workflow.connections || []
    }, token)
  }

  const {
    data: workflow,
    isLoading: workflowLoading,
    // refetch: refetchWorkflows,
  } = useQuery(`workflow-${workflowDocId}`, fetchWorkflow);

  if (workflowLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <Card className="w-[300px]">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-center text-sm text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ReactFlowProvider>
      <WorkflowBuilder 
        syncWorkflowWithDB={syncWorkflowWithDB} 
        mode={mode}
        initialEdges={workflow?.connections ?? []} 
        initialNodes={workflow?.nodes ?? []}
      />
    </ReactFlowProvider>
  )
}