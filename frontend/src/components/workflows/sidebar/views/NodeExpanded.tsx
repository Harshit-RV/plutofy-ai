import workflowScheme from "@/workflow-scheme";
import { Dispatch, SetStateAction } from "react";
import { IConnection, INode } from "@/types/workflow";
import TriggerNodeExpanded from "./subviews/TriggerNodeExpanded";
import GeneralNodeExpanded from "./subviews/GeneralNodeExpanded";

export interface NodeExpandedProps {
  node: INode,
  nodes: INode[],
  edges: IConnection[],
  setNodes: Dispatch<SetStateAction<INode[]>>, 
  setEdges: Dispatch<SetStateAction<IConnection[]>> 
}

const NodeExpanded = ({ node, nodes, edges, setNodes, setEdges } : NodeExpandedProps ) => {
  // const nodeInfoFromScheme = workflowScheme.nodes.find(wf => wf.type == node.type);

  // if (nodeInfoFromScheme?.category == "trigger") {
  //   return <TriggerNodeExpanded node={node}/>
  // }

  // TODO: (for far future) all if else checks for Nodes should happen here 
  // and respective data changing components and visual components like 
  // trailing content (Add LLM, Add tools buttons in AI agent node) should go as props here in GeneralNodeExpanded
  return (
    <div className="overflow-y-scroll overflow-x-clip">
      <GeneralNodeExpanded node={node} nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges}/>
    </div>
  )
}

export default NodeExpanded;

