import workflowScheme from "@/workflow-scheme";
import { useState, useEffect } from "react";
import { ButtonCN } from "@/components/ui/buttoncn";
import { INode, NodeType } from "@/types/workflow";
import SingleInputField from "../SingleInputField";
import SelectCredentials from "@/components/workflows/sidebar/components/SelectCredentials";
import AgentNodeExpanded from "../../components/AgentNodeExpanded";
import { NodeExpandedProps } from "../NodeExpanded";

const GeneralNodeExpanded = ({ node, setNodes, setEdges } : NodeExpandedProps) => {
  const nodeInfoFromScheme = workflowScheme.nodes.find(wf => wf.type == node.type);
  
  const [localData, setLocalData] = useState<INode>(() => node || {});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setLocalData(node || {});
    setHasUnsavedChanges(false);
  }, [node.id, node.data]);

  const handleSave = () => {
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

  const handleDataInputChange = (fieldName: string, value: unknown) => {
    setLocalData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [fieldName]: value
      } 
    }));
    setHasUnsavedChanges(true);
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

      { nodeInfoFromScheme?.credentials.length != 0 && (
        <div className="border-y py-4 my-3">
          <p className="text-xs mb-2">Credentials</p>
          <SelectCredentials value={localData.credentials} setValue={(val) => handleCredentialsChange(val)} nodeType={node.type ?? ""}/>
        </div>
      )}

      <div>
        {
          nodeInfoFromScheme?.data.map((inputField, index) => (
            <div key={index} className='mt-4'>
              <p className='text-xs mb-1'>{inputField.displayName}</p>
              <SingleInputField 
                key={`${index}-${nodeInfoFromScheme.type}-${inputField.name}`}
                type={inputField.type} 
                value={(localData.data ?? {})[inputField.name] ?? ''} 
                onValueChange={(val) => handleDataInputChange(inputField.name, val)}
                name={inputField.name} 
                displayName={inputField.displayName} 
              />
            </div>
          ))
        }
      </div>
      
      { !(nodeInfoFromScheme?.credentials.length == 0 && nodeInfoFromScheme?.data.length == 0) && (
        <div className='mt-6 pt-4 border-t'>
          <ButtonCN 
            onClick={handleSave}
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