import { API_URL } from "@/config";
import { INode, NodeType } from "@/types/workflow";
import workflowScheme from "@/workflow-scheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <Card className="">
            <CardHeader className="pt-5 pb-3 px-3 md:px-4">
              <CardTitle className="flex justify-between">
                <h4 className="text-sm font-semibold">
                  URL
                </h4>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-4 px-3 md:px-4">
              <div className="border rounded-md p-1 break-all">{API_URL}/webhook/{node.data.webhookId}</div>
            </CardContent>
          </Card>
        )
      }
     
    </div>
  )
}

export default TriggerNodeExpanded;