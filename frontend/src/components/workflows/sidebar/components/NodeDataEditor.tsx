import { Dispatch, SetStateAction, useEffect } from "react";
import SingleInputField from "../views/SingleInputField";
import { INode } from "@/types/workflow";
import { NodeInfo } from "@/workflow-scheme";

interface NodeDataEditorProps {
  nodeInfoFromScheme: NodeInfo,
  node: INode,
  setNodes: Dispatch<SetStateAction<INode[]>>,
  localData: INode,
  setLocalData: Dispatch<SetStateAction<INode>>,
  hasUnsavedChanges: boolean,
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>,
}

const NodeDataEditor = ( props: NodeDataEditorProps ) => {

  const handleDataInputChange = (fieldName: string, value: unknown) => {
    props.setLocalData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [fieldName]: value
      } 
    }));
    props.setHasUnsavedChanges(true);
  };

  useEffect(() => {
    props.setLocalData(props.node || {});
    props.setHasUnsavedChanges(false);
  }, [props.node.id, props.node.data]);

  return (
    <div>
        {
          props.nodeInfoFromScheme.data.map((inputField, index) => (
            <div key={index} className='mt-4'>
              <p className='text-xs mb-1'>{inputField.displayName}</p>
              <SingleInputField 
                key={`${index}-${props.nodeInfoFromScheme.type}-${inputField.name}`}
                type={inputField.type} 
                value={(props.localData.data ?? {})[inputField.name] ?? ''} 
                onValueChange={(val) => handleDataInputChange(inputField.name, val)}
                name={inputField.name} 
                displayName={inputField.displayName} 
              />
            </div>
          ))
        }
    </div>
  )
}

export default NodeDataEditor;