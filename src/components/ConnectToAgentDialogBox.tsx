import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ButtonCN } from "@/components/ui/buttoncn"

import { Copy } from "lucide-react"

const returnCodeSamples = (agentId: string) => {
  return `curl -X GET "https://api.plutofy.live/v1/completion" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-api-key-here" \\
  --data '{
    "agentId": "${agentId}",
    "message": "your input here"
  }'`
}


export const ConnectToAgentDialogBox = ({ agentId } : { agentId: string}) => {
  return (
    <Dialog>
      <DialogTrigger >
        <ButtonCN variant={'default'} size={'sm'} className="h-8 px-4">Connect</ButtonCN>
      </DialogTrigger>
      <DialogContent className="min-w-[650px] gap-2">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-xl">Connect to Agent</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-gray-500 mt-4">Agent ID</h3>
            <div className="bg-gray-100 text-sm py-2 px-4 border rounded-md">{agentId}</div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-gray-500 mt-4">Code</h3>
            
            <div className="bg-gray-800 h-full text-gray-100 p-4 rounded-md overflow-auto relative">
              <pre className="text-sm font-mono">
                <code>
                  {returnCodeSamples(agentId)}
                </code>
              </pre>
              <ButtonCN variant="ghost" size="sm" className="absolute bottom-2 right-2 text-gray-400 hover:text-white">
                <Copy className="h-4 w-4" />
              </ButtonCN>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}