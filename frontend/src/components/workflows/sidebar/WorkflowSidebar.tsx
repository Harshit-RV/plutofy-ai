import { NodeType, SidebarState, INode } from "@/types/workflow";
import AddNodeSection from "./views/AddNodeSection"
import NodeExpanded from "./views/NodeExpanded"
import { Node } from '@xyflow/react';
import { Dispatch, SetStateAction } from "react";

interface WorkflowSidebarProps {
  sidebarState: SidebarState,
  onAddNode: (type: NodeType) => void,
  setNodes: Dispatch<SetStateAction<Node[]>>,
  currentNodes: INode[]
}

const WorkflowSidebar = ( props : WorkflowSidebarProps ) => {
  return (
    <div className='flex flex-col h-full w-full'>

      { (props.sidebarState.mode === "NODE-EXPANDED" && props.sidebarState.selectedNodes.length !=0) ? (
        <NodeExpanded 
          // force NodeExpanded to rerender when node is changes
          key={props.sidebarState.selectedNodes[0].id} 
          node={props.sidebarState.selectedNodes[0]} 
          setNodes={props.setNodes} 
        />
      ) : (
        <AddNodeSection onAddNode={props.onAddNode} currentNodes={props.currentNodes}></AddNodeSection>
      )}

    </div>
  )
}

export default WorkflowSidebar