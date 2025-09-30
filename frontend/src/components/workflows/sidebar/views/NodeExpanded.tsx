import workflowScheme from "@/workflow-scheme";
import { Dispatch, SetStateAction } from "react";
import { IConnection, INode } from "@/types/workflow";
import TriggerNodeExpanded from "./subviews/TriggerNodeExpanded";
import GeneralNodeExpanded from "./subviews/GeneralNodeExpanded";

export interface NodeExpandedProps {
  node: INode, 
  setNodes: Dispatch<SetStateAction<INode[]>>, 
  setEdges: Dispatch<SetStateAction<IConnection[]>> 
}

const NodeExpanded = ({ node, setNodes, setEdges } : NodeExpandedProps ) => {
  const nodeInfoFromScheme = workflowScheme.nodes.find(wf => wf.type == node.type);

  if (nodeInfoFromScheme?.category == "trigger") {
    return <TriggerNodeExpanded node={node}/>
  }

  return (
    <GeneralNodeExpanded node={node} setNodes={setNodes} setEdges={setEdges}/>
  )
}

export default NodeExpanded;

