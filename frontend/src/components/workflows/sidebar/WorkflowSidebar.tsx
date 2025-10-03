import { NodeType, SidebarState, INode, IConnection } from "@/types/workflow";
import AddNodeSection from "./views/AddNodeSection"
import NodeExpanded from "./views/NodeExpanded"
import { Dispatch, SetStateAction } from "react";

interface WorkflowSidebarProps {
  sidebarState: SidebarState,
  nodes: INode[]
  edges: IConnection[]
  onAddNode: (type: NodeType) => void,
  setNodes: Dispatch<SetStateAction<INode[]>>,
  setEdges:  Dispatch<SetStateAction<IConnection[]>>,
  currentNodes: INode[]
}

const WorkflowSidebar = ( props : WorkflowSidebarProps ) => {
  return (
    <div className='flex flex-col h-full w-full'>

      { (props.sidebarState.mode === "NODE-EXPANDED" && props.sidebarState.selectedNodes.length !=0) ? (
        <NodeExpanded 
          // force NodeExpanded to rerender when node is changes
          nodes={props.nodes}
          edges={props.edges}
          key={props.sidebarState.selectedNodes[0].id} 
          node={props.sidebarState.selectedNodes[0]} 
          setNodes={props.setNodes}
          setEdges={props.setEdges}
        />
      ) : (
        <AddNodeSection onAddNode={props.onAddNode} currentNodes={props.currentNodes}></AddNodeSection>
      )}

    </div>
  )
}

export default WorkflowSidebar