import LlmNode, { AgentNode, ConditionNode, EmailNode, TelegramNode, WebhookTriggerNode } from '@/components/LlmNode';
import { ButtonCN } from '@/components/ui/buttoncn';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import WorkflowService from '@/utils/workflow.util';
import { useAuth } from '@clerk/clerk-react';
import { Background, Connection, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react";
import { IConnection } from '@/types/workflow';
import { throttle } from 'lodash';

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

export default function WorkflowBuilderPage({ mode } : { mode: Mode }) {
  const { workflowDocId } = useParams(); 
  const { getToken } = useAuth();

  const fetchWorkflow = async () => {
    const token = await getToken();
    if (!token) return;
    if (!workflowDocId) return;
    return await WorkflowService.getWorkflowById(workflowDocId, token);
  };

  const syncWorkflowWithDB = async (nodes: Node[], edges: IConnection[], name: string) => {
    const token = await getToken();
    if (!token) return;
    if (!workflow) return;
    await WorkflowService.updateWorkflow(String(workflow._id), {
      ...workflow,
      name: name,
      nodes: nodes,
      connections: edges
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
        workflowName={workflow?.name ?? ""}
        initialEdges={workflow?.connections ?? []} 
        initialNodes={workflow?.nodes ?? []}
      />
    </ReactFlowProvider>
  )
}

const WorkflowBuilder = ({ workflowName, initialEdges, initialNodes, syncWorkflowWithDB } : { workflowName: string, mode: Mode, initialEdges: IConnection[], initialNodes: Node[], syncWorkflowWithDB: (nodes: Node[], edges: IConnection[], name: string) => void }) => {
  const [ nodes,, onNodesChange ] = useNodesState(initialNodes);
  const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);
  const [ name, setName ] = useState(workflowName);
  const { getNode } = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) => [...edges, { id: `${connection.source}+${connection.target}`, source: connection.source, target: connection.target }]);
    },
    [setEdges]
  );

  
  const throttledSync = useMemo(
    () => throttle((n, e, nm) => syncWorkflowWithDB(n, e, nm), 2000, { trailing: true }),
    [syncWorkflowWithDB]
  );

  useEffect(() => {
    throttledSync(nodes, edges, name);
  }, [nodes, edges, name, throttledSync]);

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

      <Input className='absolute w-min left-10 top-10 z-10' value={name} onChange={(e) => setName(e.target.value)} />

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


