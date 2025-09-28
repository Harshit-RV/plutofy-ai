import { ButtonCN } from "@/components/ui/buttoncn";
import { IConnection, INode, NodeType } from "@/types/workflow";
import { NodeInfo } from "@/workflow-scheme";
import { v4 as uuid } from "uuid"
import { NodeExpandedProps } from "../views/NodeExpanded";
import { addEdge } from "@xyflow/react";

interface AgentNodeExpandedProps extends NodeExpandedProps {
  nodeInfo: NodeInfo
}

const AgentNodeExpanded = ({ node, setNodes, setEdges } : AgentNodeExpandedProps ) => {

  const addLLm = () => {
    const newNodeId = uuid();

    const newNode: INode = {
      id: newNodeId,
      type: NodeType.agentLlmNode,
      position: { x: Math.floor(Math.random() * 101), y: Math.floor(Math.random() * 101) },
      data: {},
    };

    setNodes((nds) => nds.concat(newNode));
    
    const newConnection: IConnection = {
      id: uuid(),
      source: node.id,
      target: newNodeId,
      sourceHandle: "llm",
      type: "child"
    }

    setEdges((oldEdges) => addEdge(newConnection, oldEdges));
  }

  const addTool = () => {
    const newNodeId = uuid();

    const newNode: INode = {
      id: newNodeId,
      type: NodeType.agentToolNode,
      position: { x: Math.floor(Math.random() * 101), y: Math.floor(Math.random() * 101) },
      data: {},
    };

    setNodes((nds) => nds.concat(newNode));
    
    const newConnection = {
      id: uuid(),
      source: node.id,
      target: newNodeId,
      sourceHandle: "tool",
      type: "child"
    }

    setEdges((oldEdges) => addEdge(newConnection, oldEdges));
  }

  // const addMemory = () => {
  //   const newNodeId = uuid();

  //   const newNode: INode = {
  //     id: newNodeId,
  //     type: NodeType.agentToolNode,
  //     position: { x: Math.floor(Math.random() * 101), y: Math.floor(Math.random() * 101) },
  //     data: {},
  //   };

  //   setNodes((nds) => nds.concat(newNode));
    
  //   const newConnection = {
  //     id: uuid(),
  //     source: node.id,
  //     target: newNodeId,
  //     sourceHandle: "llm"
  //   }

  //   setEdges((oldEdges) => addEdge(newConnection, oldEdges));
  // }

  return ( 
    <div>
      <ButtonCN onClick={() => addLLm()}>add llm</ButtonCN>
      {/* <ButtonCN onClick={() => addMemory()}>add memory</ButtonCN> */}
      <ButtonCN onClick={() => addTool()}>add tool</ButtonCN>
    </div>
  )
}

export default AgentNodeExpanded;