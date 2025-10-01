import AgentLlmNode from '@/components/workflows/nodes/agent-children-nodes/AgentLlmNode';
import AgentNode from '@/components/workflows/nodes/AgentNode';
import ConditionNode from '@/components/workflows/nodes/ConditionNode';
import EmailNode from '@/components/workflows/nodes/EmailNode';
import TelegramNode from '@/components/workflows/nodes/TelegramNode';
import WebhookTriggerNode from '@/components/workflows/nodes/WebhookTriggerNode';
import { ButtonCN } from '@/components/ui/buttoncn';
import { Input } from '@/components/ui/input';
import WorkflowService from '@/utils/workflow.util';
import { useAuth } from '@clerk/clerk-react';
import { Background, Connection, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow, Node, useOnSelectionChange, NodeChange } from '@xyflow/react';
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
import { IConnection, INode, NodeType, SidebarState } from '@/types/workflow';
import { throttle } from 'lodash';
import { v4 as uuid } from "uuid";
import WorkflowSidebar from '@/components/workflows/sidebar/WorkflowSidebar';
import WebhookService from '@/utils/webhook.util';
import HttpRequestToolNode from '@/components/workflows/nodes/agent-children-nodes/HttpRequestToolNode';

const nodeTypes = {
  agentLlmNode: AgentLlmNode,
  webhookTriggerNode: WebhookTriggerNode,
  emailNode: EmailNode,
  telegramNode: TelegramNode,
  agentNode: AgentNode,
  conditionNode: ConditionNode,
  httpRequestToolNode: HttpRequestToolNode,
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
    async (nodes: INode[], edges: IConnection[], name: string) => {
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
      <div className='h-[calc(100vh-3.5rem)] w-full p-4 bg-gray-100'>
        <WorkflowBuilder 
          workflowDocId={workflowDocId ?? ""}
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

interface WorkflowBuilderProps {
  workflowName: string,
  mode: Mode,
  workflowDocId: string,
  initialEdges: IConnection[],
  initialNodes: INode[],
  syncWorkflowWithDB: (nodes: INode[], edges: IConnection[], name: string) => void
}

const WorkflowBuilder = ({ workflowName, initialEdges, initialNodes, syncWorkflowWithDB, workflowDocId } : WorkflowBuilderProps) => {
  const [ nodes, setNodes, onNodesChange ] = useNodesState<INode>(initialNodes);
  const [ edges, setEdges, onEdgesChange ] = useEdgesState<IConnection>(initialEdges);
  const [ sidebarState, setSidebarState ] = useState<SidebarState>({ mode: "CLOSED", selectedNodes: [] })
  const [ name, setName ] = useState(workflowName);
  const { getNode } = useReactFlow();
  const { getToken } = useAuth();

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: IConnection = { 
        id: `${connection.source}+${connection.target}`, 
        source: connection.source, 
        target: connection.target,
        sourceHandle: connection.sourceHandle ? connection.sourceHandle : undefined
      }

      setEdges((edges) => [...edges, newEdge]);
    },
    [setEdges]
  );

  const onAddNode = useCallback(async (type: NodeType) => {
    const newId = `${type}-${uuid()}`
    let nodeData = {}
    
    // add entry in Webhook table if webhookTriggerNode is added
    if (type == NodeType.webhookTriggerNode) {
      const token = await getToken();
      if (!token) return;
      
      const webhookDoc = await WebhookService.createWebhook({
        nodeId: newId,
        workflowId: workflowDocId,
      }, token)

      nodeData = { webhookId: webhookDoc._id }
    }

    const newNode: INode = {
      id: newId,
      type: type,
      position: { x: Math.floor(Math.random() * 101), y: Math.floor(Math.random() * 101) },
      data: nodeData,
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, getToken, workflowDocId]);
  
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

  const onSelectionChange = useCallback(({ nodes } : { nodes: Node[] }) => {
    if (nodes.length == 0) {
      setSidebarState((val) => {
        if (val.mode == "NODE-EXPANDED") {
          return { mode: "CLOSED", selectedNodes: [] }
        }
        return val;
      })
      return
    }

    setSidebarState( { mode: "NODE-EXPANDED", selectedNodes: nodes } );
  }, []);

  const unselectNodeOnPositionChange = (changes: NodeChange<INode>[]) => {
    if (changes.length == 0) return

    if (changes[0].type == "position") {
      onSelectionChange({nodes: []})
    }
  }

  const handleWebhookTriggerNodeChanges = async (changes: NodeChange<INode>[]) => {
    if (changes.length == 0) return
    
    if (changes[0].type == "remove") {
      const deletedNode = getNode(changes[0].id)
      
      // delete entry from Webhook table when webhookTriggerNode is removed
      if (deletedNode?.type == NodeType.webhookTriggerNode) {
        const token = await getToken();
        if (token) {
          await WebhookService.deleteWebhookByWorkflowId(workflowDocId, token);
        }
      }
    }
  }

  useOnSelectionChange({
    onChange: onSelectionChange
  });

  return (
    <div className='relative h-full w-full'>

      <Input className='absolute w-min left-4 top-4 z-10' value={name} onChange={(e) => setName(e.target.value)} /> 

      <ButtonCN
        onClick={() => setSidebarState((val) => {
          if (val.mode == "ADD-NODE") {
            return { mode: "CLOSED", selectedNodes: [] }
          }

          return { mode: "ADD-NODE", selectedNodes: [] }
        })}
        className="flex gap-3 border absolute top-4 right-4 z-10"
        variant="outline"
      >
        <FaPlus className={sidebarState.mode == "ADD-NODE" ? 'rotate-45' : ""}/> Add node
      </ButtonCN>


      {(sidebarState.mode != "CLOSED") &&
        <div className='top-16 bottom-4 right-4 absolute rounded-lg border-gray-200 z-10 bg-white w-[400px] shadow-xl'>
          <WorkflowSidebar 
            sidebarState={sidebarState}
            onAddNode={onAddNode}
            setEdges={setEdges}
            setNodes={setNodes}
            currentNodes={nodes}
          />
        </div>
      }

      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={(changes) => (onNodesChange(changes), unselectNodeOnPositionChange(changes), handleWebhookTriggerNodeChanges(changes))}
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        isValidConnection={(connection) => {
          const sourceNode = getNode(connection.source);
          const targetNode = getNode(connection.target);

          if (targetNode?.type === NodeType.agentLlmNode) {
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
