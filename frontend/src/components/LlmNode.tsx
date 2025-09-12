import { AgentCard } from "@/pages/Home";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// import { Input } from "./ui/input";

const LlmNode = ({ data : { llm } }: { data : { llm: string } }) => {
  return (
    <div className='h-full w-full'>
      <Handle type="target" position={Position.Top} />
      {/* <AgentCard 
          name={'agent.name'} 
          description={'agent.description'}
          agentDocId={'agent._id'}
          onDelete={() => {}}
          onEdit={() => {}}
      /> */}
      <Card className="w-96 max-w-lg">
        <CardHeader>
          <CardTitle>LLM Playground {llm}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select LLM model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="claude-2">Claude 2</SelectItem>
              <SelectItem value="llama-2">LLaMA 2</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Enter your prompt here..."
          />
          <div className="border p-2 px-3 rounded">
            <pre className="w-full h-40 font-mono text-sm overflow-auto">
              {"Output will appear here..."}
            </pre>
            {/* <ChevronDown className="absolute right-3 bottom-3 text-gray-400" /> */}
          </div>
        </CardContent>
        <CardFooter className="text-xs">Model: | Tokens: 0 | Time: 0ms</CardFooter>
      </Card>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        // style={handleStyle}
      />
    </div>
  )
}


export const AgentNode = () => {
  return (
    <div className='h-full w-full'>
      <Handle type="target" position={Position.Top} />
      <AgentCard 
          name={'agent.name'} 
          description={'agent.description'}
          agentDocId={'agent._id'}
          onDelete={() => {}}
          onEdit={() => {}}
      />
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        // style={handleStyle}
      />
    </div>
  )
}


export default LlmNode;