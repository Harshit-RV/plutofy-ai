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
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react";
import { IConnection, NodeType } from '@/types/workflow';
import { throttle } from 'lodash';
import { MdOutlineWebhook } from 'react-icons/md';
import workflowScheme from '@/workflow-scheme';
import { v4 as uuid } from "uuid";

const nodeTypes = {
  llmNode: LlmNode,
  webhookTriggerNode: WebhookTriggerNode,
  emailNode: EmailNode,
  telegramNode: TelegramNode,
  agentNode: AgentNode,
  conditionNode: ConditionNode,
}


type Mode = 'CREATE' | 'EDIT';

export default function WorkflowBuilderPage({ mode } : { mode: Mode }) {
  const { workflowDocId } = useParams(); 
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const fetchWorkflow = async () => {
    const token = await getToken();
    if (!token) return;
    if (!workflowDocId) return;
    return await WorkflowService.getWorkflowById(workflowDocId, token);
  };

  const syncWorkflowWithDB = useCallback(
    async (nodes: Node[], edges: IConnection[], name: string) => {
      const token = await getToken();
      if (!token) return;
      if (!workflowDocId) return;
  
      queryClient.setQueryData([`workflow-${workflowDocId}`], (oldData: unknown) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          name,
          nodes,
          connections: edges,
        };
      });
  
      await WorkflowService.updateWorkflow(workflowDocId, {
        name,
        nodes,
        connections: edges,
      }, token);
    },
    [getToken, queryClient, workflowDocId]
  );

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
      <div className='h-screen w-full p-4 bg-gray-100 pb-20'>
        <WorkflowBuilder 
          syncWorkflowWithDB={syncWorkflowWithDB} 
          mode={mode}
          workflowName={workflow?.name ?? ""}
          initialEdges={workflow?.connections ?? []} 
          initialNodes={workflow?.nodes ?? []}
        />
      </div>
    </ReactFlowProvider>
  )
}

const WorkflowBuilder = ({ workflowName, initialEdges, initialNodes, syncWorkflowWithDB } : { workflowName: string, mode: Mode, initialEdges: IConnection[], initialNodes: Node[], syncWorkflowWithDB: (nodes: Node[], edges: IConnection[], name: string) => void }) => {
  const [ nodes, setNodes, onNodesChange ] = useNodesState(initialNodes);
  const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);
  const [ name, setName ] = useState(workflowName);
  const [ isSidebarVisible, setIsSidebarVisible ] = useState(true)
  const { getNode } = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) => [...edges, { id: `${connection.source}+${connection.target}`, source: connection.source, target: connection.target }]);
    },
    [setEdges]
  );

  const onAddNode = useCallback((type: NodeType) => {
    const newNode = {
      id: uuid(),
      type: type,
      position: { x: 100, y: 100 },
      data: {},
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);
  
  const throttledSync = useMemo(
    () => throttle((n, e, nm) => syncWorkflowWithDB(n, e, nm), 2000, { trailing: true }),
    [syncWorkflowWithDB]
  );

  useEffect(() => {
    throttledSync(nodes, edges, name);
  }, [nodes, edges, name, throttledSync]);

  useEffect(() => {
    return () => throttledSync.cancel();
  }, [throttledSync]);

  return (
    <div className='relative h-full w-full'>

      <Input className='absolute w-min left-4 top-4 z-10' value={name} onChange={(e) => setName(e.target.value)} /> 

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ButtonCN
            className="absolute hidden bottom-10 left-10 z-10 gap-3 border"
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
      
      <ButtonCN
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className="flex gap-3 border absolute top-4 right-4 z-10"
        variant="outline"
      >
        <FaPlus /> Add node
      </ButtonCN>

      {isSidebarVisible &&
        <div className='top-16 bottom-4 right-4 absolute rounded-lg border-gray-200 z-10 bg-white w-[400px] shadow-xl'>

          <div className='flex flex-col h-full w-full'>

            <h1 className='my-7 ml-3 font-bold text-gray-900'>Available Nodes</h1>

            {
              workflowScheme.nodes.map((node) => (
                <div onClick={() => onAddNode(node.type as NodeType)} className='flex hover:shadow-md items-center h-20 cursor-pointer px-4 py-3 border-y gap-4'>
                  
                  <MdOutlineWebhook size={30} color="purple"/>
                  
                  <div className='flex w-4/5 flex-col gap-1'>
                    <h1 className='text-sm font-bold'>{node.name}</h1>
                    <p className='text-xs text-gray-400'>{node.description}</p>
                  </div>
                </div>
              ))
            }
            
          </div>
        </div>
      }


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

