import { NodeType, INode } from "@/types/workflow";
import workflowScheme from "@/workflow-scheme";

const AddNodeSection = ( { onAddNode, currentNodes } : { onAddNode: (type: NodeType) => void, currentNodes: INode[] } ) => {
  const hasTriggerNode = currentNodes.some(node => {
    const nodeInfo = workflowScheme.nodes.find(schemeNode => schemeNode.type === node.type);
    return nodeInfo?.category === "trigger";
  });

  const availableNodes = workflowScheme.nodes.filter(node => {
    if (node.category === "trigger" && hasTriggerNode) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <h1 className='my-7 ml-3 font-bold text-foreground'>Available Nodes</h1>
      {
        availableNodes.map((node, index) => (
          <div key={index} onClick={() => onAddNode(node.type as NodeType)} className='flex hover:shadow-md items-center h-20 cursor-pointer px-4 py-3 border-y gap-5'>
            
            <img src={node.image} className='size-8' alt="" />
            
            <div className='flex w-4/5 flex-col gap-1'>
              <h1 className='text-sm font-bold'>{node.name}</h1>
              <p className='text-xs text-gray-400'>{node.description}</p>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default AddNodeSection;