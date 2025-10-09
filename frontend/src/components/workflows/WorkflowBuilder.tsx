import { Background, Connection, ReactFlow, useEdgesState, useNodesState, useReactFlow, useOnSelectionChange, NodeChange } from '@xyflow/react';
import { ButtonCN } from '@/components/ui/buttoncn';
import { Input } from '@/components/ui/input';
import { FaPlus } from 'react-icons/fa';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IConnection, INode, NodeType, SidebarState } from '@/types/workflow';
import { throttle } from 'lodash';
import { v4 as uuid } from "uuid";
import WorkflowSidebar from '@/components/workflows/sidebar/WorkflowSidebar';
import WebhookService from '@/services/webhook.service';
import WorkflowValidator from '@/utils/workflow-validator.util';
import { useAuth } from '@clerk/clerk-react';
import nodeTypes from './node-types';
import { MdError } from "react-icons/md";

interface WorkflowBuilderProps {
  workflowName: string,
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

  const isWorkflowCorrectlyConfigured = useMemo(() => !WorkflowValidator.isWorkflowConfigCorrect(nodes), [nodes]);

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

  const onSelectionChange = useCallback(({ nodes } : { nodes: INode[] }) => {
    if (nodes.length == 0) {
      setSidebarState((val) => {
        if (val.mode == "NODE-EXPANDED") return { mode: "CLOSED", selectedNodes: [] }
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
      
      {isWorkflowCorrectlyConfigured && (
        <div className='h-8 bg-background absolute top-5 text-red-600 right-40 z-10 rounded-md px-3 flex gap-2 items-center'>
          <MdError />
          <span className='text-xs font-bold'>Some nodes are misconfigured</span>
        </div>
      )}


      {(sidebarState.mode != "CLOSED") &&
        <div className='top-16 bottom-4 right-4 absolute rounded-lg border-gray-200 z-10 bg-background w-[500px] shadow-xl'>
          <WorkflowSidebar 
            sidebarState={sidebarState}
            onAddNode={onAddNode}
            nodes={nodes}
            edges={edges}
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

export default WorkflowBuilder;