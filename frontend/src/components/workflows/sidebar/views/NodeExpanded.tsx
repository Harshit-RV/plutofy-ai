import workflowScheme from "@/workflow-scheme";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Node } from '@xyflow/react';
import SingleInputField from "./SingleInputField";
import { ButtonCN } from "@/components/ui/buttoncn";

const NodeExpanded = ({ node, setNodes } : { node: Node, setNodes: Dispatch<SetStateAction<Node[]>> }) => {
  const nodeInfoFromScheme = workflowScheme.nodes.find(wf => wf.type == node.type);
  
  const [localData, setLocalData] = useState<Record<string, unknown>>(() => 
    node.data || {}
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setLocalData(node.data || {});
    setHasUnsavedChanges(false);
  }, [node.id, node.data]);

  const handleSave = () => {
    setNodes((nodes) =>
      nodes.map((singleNode) => {
        if (singleNode.id === node.id) {
          return {
            ...singleNode,
            data: localData
          };
        }
        return singleNode;
      }),
    );
    setHasUnsavedChanges(false);
  };

  const handleInputChange = (fieldName: string, value: unknown) => {
    setLocalData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    setHasUnsavedChanges(true);
  };

  return (
    <div className='flex flex-col w-full py-5 px-4'>
      
      <div className='flex items-center gap-3'>
        <img src={nodeInfoFromScheme?.image} className='size-10' alt="" />
        <h1 className='font-bold text-lg'>{nodeInfoFromScheme?.name}</h1>
      </div>

      <p className='text-sm mt-3'>{nodeInfoFromScheme?.description}</p>
      
      <div className='mt-5'>
        {
          nodeInfoFromScheme?.data.map((inputField, index) => (
            <div key={index} className='mt-4'>
              <p className='text-sm'>{inputField.displayName}</p>
              <SingleInputField 
                key={`${index}-${nodeInfoFromScheme.type}-${inputField.name}`}
                type={inputField.type} 
                value={localData[inputField.name] as string} 
                
                onValueChange={(val) => handleInputChange(inputField.name, val)}

                name={inputField.name} 
                displayName={inputField.displayName} 
              />
            </div>
          ))
        }
      </div>

      <div className='mt-6 pt-4 border-t'>
        <ButtonCN 
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className='w-full'
        >
          {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
        </ButtonCN>
      </div>
    </div>
  )
}

export default NodeExpanded;
