import { API_URL } from "@/config";
import { INode, NodeType } from "@/types/workflow";
import workflowScheme from "@/workflow-scheme";

const TriggerNodeExpanded = ({ node } : { node: INode }) => {
  const nodeInfoFromScheme = workflowScheme.nodes.find(wf => wf.type == node.type);
  
  return (
    <div className='flex flex-col w-full py-10 px-4'>
      
      <div className='flex flex-col items-center gap-3 pb-10 border-b'>
        <img src={nodeInfoFromScheme?.image} className='size-32' alt="" />
        <h1 className='font-bold text-lg'>{nodeInfoFromScheme?.name}</h1>
      </div>
      
      <p className='text-sm mt-5'>{nodeInfoFromScheme?.description}</p>
      
      {
        node.type == NodeType.webhookTriggerNode && (
          <div className="flex flex-col mt-4 gap-1">
            <p className="text-xs">URL</p>
            <div className="border rounded-md p-1 break-all">{API_URL}/webhook/{node.data.webhookId}</div>
          </div>
        )
      }
     
    </div>
  )
}

export default TriggerNodeExpanded;