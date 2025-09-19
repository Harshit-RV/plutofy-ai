import { Handle, Position } from "@xyflow/react";
import { MdOutlineEmail, MdOutlineWebhook } from "react-icons/md";
import { ReactNode } from "react";
import { FaGoogle, FaProjectDiagram, FaTelegram } from "react-icons/fa";
import { Bot } from "lucide-react";

// import { Input } from "./ui/input";

// const 

const LlmNode = () => {
  return (
    <div className='size-full rounded-full border p-2 bg-white'>
      <FaGoogle />
      <Handle 
        type="target" 
        position={Position.Top}
      />
    </div>
  )
}


export const AgentNode = () => {
  return (
    <div className='h-full w-full bg-white border rounded-lg p-3'>
      <Handle type="target" position={Position.Left}/>
      
      <div className="flex gap-2 items-center ">
        <Bot className="size-6" />
        <p className="text-[10px]">AI Agent</p>
      </div>

      <Handle type="source" position={Position.Bottom}/>
      <Handle
        type="source"
        position={Position.Right}
        // style={handleStyle}
      />
    </div>
  )
}


export const WebhookTriggerNode = () => {
  return (
    <GeneralTriggerNode>
      <MdOutlineWebhook size={24}/>
      <p className="text-[6px] mx-0">Webhook</p>

      <Handle
        type="source"
        position={Position.Right}
        id="b"
      />
    </GeneralTriggerNode>
  )
}

export const EmailNode = () => {
  return (
    <GeneralActionNode>
      <MdOutlineEmail size={24}/>

      <Handle
        type="source"
        position={Position.Right}
      />
      <Handle
        type="target"
        position={Position.Left}
      />
    </GeneralActionNode>
  )
}

export const TelegramNode = () => {
  return (
    <GeneralActionNode> 
      <FaTelegram size={24}/>

      <Handle
        type="source"
        position={Position.Right}
        id="b"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
      />
    </GeneralActionNode>
  )
}


export const ConditionNode = () => {
  return (
    <GeneralActionNode>
      <FaProjectDiagram size={20}/>
      <p className="text-[6px] pt-0.5">if/else</p>
      <Handle
        type="source"
        position={Position.Right}
        id="1"
        style={{ top: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="2"
        style={{ bottom: '30%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
      />
    </GeneralActionNode>
  )
}


const GeneralActionNode = ({ children } : { children: ReactNode}) => {
  return (
    <div className="size-14 bg-white border rounded-lg px-5 flex flex-col justify-center items-center">
      {children}
    </div>
  )
}

const GeneralTriggerNode = ({ children } : { children: ReactNode}) => {
  return (
    <div className="size-14 bg-white border rounded-lg px-5 pl-7 flex flex-col justify-center items-center rounded-l-full">
      {children}
    </div>
  )
}


export default LlmNode;