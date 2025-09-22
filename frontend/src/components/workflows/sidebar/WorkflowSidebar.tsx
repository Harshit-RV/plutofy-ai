import { NodeType } from "@/types/workflow";
import AddNodeSection from "./views/AddNodeSection"
import NodeExpanded from "./views/NodeExpanded"
import { Node } from '@xyflow/react';
import { Dispatch, SetStateAction } from "react";

interface WorkflowSidebarProps {
  selectedNodes: Node[],
  onAddNode: (type: NodeType) => void,
  setNodes: Dispatch<SetStateAction<Node[]>>
}

const WorkflowSidebar = ( props : WorkflowSidebarProps ) => {
  return (
    <div className='flex flex-col h-full w-full'>

      { props.selectedNodes.length !=0 ? (
        <NodeExpanded node={props.selectedNodes[0]} setNodes={props.setNodes} />
      ) : (
        <AddNodeSection onAddNode={props.onAddNode}></AddNodeSection>
      )}

    </div>
  )
}

export default WorkflowSidebar