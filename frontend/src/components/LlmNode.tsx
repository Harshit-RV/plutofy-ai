import { Handle, Position, useNodeConnections, useNodeId, useReactFlow } from "@xyflow/react";
import { MdOutlineEmail, MdOutlineWebhook } from "react-icons/md";
import { ReactNode } from "react";
import { FaCode, FaGoogle, FaProjectDiagram, FaTelegram } from "react-icons/fa";
import { Bot, Plus } from "lucide-react";
import { ButtonHandle } from "@/components/button-handle";
import { ButtonCN } from "./ui/buttoncn";
import { v4 as uuid } from "uuid";
import { NodeType } from "@/pages/WorkflowBuilder";
// import { Input } from "./ui/input";

// const 

const LlmNode = () => {
  return (
    <GeneralDependentNode>
      <FaGoogle />
      <Handle 
        type="target" 
        position={Position.Top}
      />
    </GeneralDependentNode>
  )
}

// const toolLogo = {
//   code: <FaCode />,
//   httpRequest: <TbWorld />
// }

export const AgentToolNode = () => {
  return (
    <GeneralDependentNode>
      <FaCode />
      <Handle 
        type="target" 
        position={Position.Top}
      />
    </GeneralDependentNode>
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
      <MdOutlineWebhook size={24} color="purple"/>
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
      <MdOutlineEmail size={24} color="#8a0000"/>

      <Handle
        type="target"
        position={Position.Left}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </GeneralActionNode>
  )
}


export const EmailNodeWithHandleButton = () => {
  const nodeId = useNodeId();
  const connections = useNodeConnections({ id: nodeId! });
  const { addNodes, addEdges } = useReactFlow();
  
  return (
    <GeneralActionNode>
      <MdOutlineEmail size={24}/>

      <ButtonHandle
        type="source"
        position={Position.Right}
        isConnectable
        showButton={connections.length < 2}
      >
        <ButtonCN
          onClick={() => {
            const newNodeId = uuid();
            addNodes(
              { id: newNodeId, position: { x: 200, y: 0 }, data: { label: 'third block' }, type: NodeType.telegramNode, },
            )
            addEdges(
              { id: uuid(), source: nodeId!, target: newNodeId }
            )
          }}
          variant="outline"
          className="rounded-full bg-transparent p-0 h-5 w-5"
        >
          <Plus size={10} color="white" />
        </ButtonCN>
      </ButtonHandle>

      <Handle
        type="target"
        position={Position.Left}
      />
      {/* <Handle
        type="target"
        position={Position.Left}
      /> */}
    </GeneralActionNode>
  )
}

export const TelegramNode = () => {
  return (
    <GeneralActionNode> 
      <FaTelegram size={24} className="text-[#24A1DE]"/>

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
      <div className="handles sources">
        <Handle
          id="1"
          type="source"
          position={Position.Right}
        />
        <Handle
          id="2"
          type="source"
          position={Position.Right}
        />
      </div>
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

const GeneralDependentNode = ({ children } : { children: ReactNode}) => {
  return (
    <div className='size-full rounded-full border p-2 bg-white'>
      {children}
    </div>
  )
}



export default LlmNode;