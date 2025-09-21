import { Handle, Position, useNodeConnections, useNodeId, useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";
import { FaGoogle } from "react-icons/fa";
import { Plus } from "lucide-react";
import { ButtonHandle } from "@/components/button-handle";
import { ButtonCN } from "./ui/buttoncn";
import { v4 as uuid } from "uuid";
import { NodeType } from "@/types/workflow";


const logos: Record<NodeType, string> = {
  [NodeType.telegramNode]: "/telegram.svg",
  [NodeType.agentNode]: "/bot.svg",
  [NodeType.conditionNode]: "/condition.svg",
  [NodeType.emailNode]: "/mail.svg",
  [NodeType.llmNode]: "/telegram.svg",
  [NodeType.webhookTriggerNode]: "/webhook.svg",
}

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
      <img
        src={logos.emailNode}
        alt="Telegram"
        className="w-6 h-6 object-contain"
      />
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
      
      <div className="flex gap-2 items-center">
        <img
          src={logos.agentNode}
          alt="Telegram"
          className="w-6 h-6 object-contain"
        />
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
      <div className="flex pl-2 flex-col w-full items-center">
        <img
          src={logos.webhookTriggerNode}
          alt="Telegram"
          className="w-6 h-6 object-contain"
        />
        <p className="text-[6px] mx-0">Webhook</p>
      </div>

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
      <img
        src={logos.emailNode}
        alt="Telegram"
        className="w-6 h-6 object-contain"
      />
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
      <img
        src={logos.emailNode}
        alt="Telegram"
        className="w-6 h-6 object-contain"
      />

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
      <img
        src={logos.telegramNode}
        alt="Telegram"
        className="w-6 h-6 object-contain"
      />

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
      <img
        src={logos.conditionNode}
        alt="Telegram"
        className="w-6 h-6 object-contain"
      />
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
    <div className="size-14 bg-white border rounded-lg flex flex-col justify-center items-center">
      {children}
    </div>
  )
}

const GeneralTriggerNode = ({ children } : { children: ReactNode}) => {
  return (
    <div className="size-14 bg-white border rounded-lg flex flex-col justify-center items-center rounded-l-full">
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