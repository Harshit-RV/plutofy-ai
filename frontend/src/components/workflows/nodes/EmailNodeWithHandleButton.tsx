import { Handle, Position, useNodeConnections, useNodeId, useReactFlow } from "@xyflow/react";
import { Plus } from "lucide-react";
import { ButtonHandle } from "@/components/button-handle";
import { ButtonCN } from "@/components/ui/buttoncn";
import { v4 as uuid } from "uuid";
import { NodeType } from "@/types/workflow";
import { GeneralActionNode } from "./shared/NodeWrappers";
import logos from "@/utils/logos";

export const EmailNodeWithHandleButton = () => {
  const nodeId = useNodeId();
  const connections = useNodeConnections({ id: nodeId! });
  const { addNodes, addEdges } = useReactFlow();
  
  return (
    <GeneralActionNode>
      <img
        src={logos.emailNode}
        alt="Email"
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
    </GeneralActionNode>
  )
}

export default EmailNodeWithHandleButton;
