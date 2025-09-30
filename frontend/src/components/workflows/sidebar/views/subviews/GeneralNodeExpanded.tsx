import workflowScheme from "@/workflow-scheme";
import { useState } from "react";
import { ButtonCN } from "@/components/ui/buttoncn";
import { INode, NodeType } from "@/types/workflow";
import SelectCredentials from "@/components/workflows/sidebar/components/SelectCredentials";
import AgentNodeExpanded from "../../components/AgentNodeExpanded";
import { NodeExpandedProps } from "../NodeExpanded";
import NodeDataEditor from "../../components/NodeDataEditor";

const GeneralNodeExpanded = ({ node, setNodes, setEdges } : NodeExpandedProps) => {
  const nodeInfoFromScheme = workflowScheme.nodes.find(wf => wf.type == node.type);
  
  const [localData, setLocalData] = useState<INode>(() => node || {});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // saves both new data and credentials
  const saveNodeChanges = () => {
    setNodes((nodes) =>
      nodes.map((singleNode) => {
        if (singleNode.id === node.id) {
          return {
            ...singleNode,
            credentials: localData.credentials,
            data: localData.data
          };
        }
        return singleNode;
      }),
    );
    setHasUnsavedChanges(false);
  };

  const handleCredentialsChange = (value: string) => {
    setLocalData(prev => ({
      ...prev,
      credentials: value
    }))
    setHasUnsavedChanges(true);
  }

  return (
    <div className='flex flex-col w-full py-5 px-4'>
      
      <div className='flex items-center gap-3'>
        <img src={nodeInfoFromScheme?.image} className='size-10' alt="" />
        <h1 className='font-bold text-lg'>{nodeInfoFromScheme?.name}</h1>
      </div>

      <p className='text-sm mt-3'>{nodeInfoFromScheme?.description}</p>

      { (nodeInfoFromScheme && nodeInfoFromScheme.credentials.length != 0) && (
        <div className="border-y py-4 my-3">
          <p className="text-xs mb-2">Credentials</p>
          <SelectCredentials value={localData.credentials} setValue={(val) => handleCredentialsChange(val)} nodeType={node.type ?? ""}/>
        </div>
      )}

      {
        (nodeInfoFromScheme && nodeInfoFromScheme.data.length != 0) && (
          <NodeDataEditor 
            nodeInfoFromScheme={nodeInfoFromScheme}
            node={node}
            setNodes={setNodes}
            localData={localData}
            setLocalData={setLocalData}
            hasUnsavedChanges={hasUnsavedChanges}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        )
      }
      
      { !(nodeInfoFromScheme?.credentials.length == 0 && nodeInfoFromScheme?.data.length == 0) && (
        <div className='mt-6 pt-4 border-t'>
          <ButtonCN 
            onClick={saveNodeChanges}
            disabled={!hasUnsavedChanges}
            className='w-full'
          >
            {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
          </ButtonCN>
        </div>
      )}

      { node.type === NodeType.agentNode && <AgentNodeExpanded node={node} nodeInfo={nodeInfoFromScheme!} setNodes={setNodes} setEdges={setEdges} /> }
    </div>
  )
}

export default GeneralNodeExpanded;