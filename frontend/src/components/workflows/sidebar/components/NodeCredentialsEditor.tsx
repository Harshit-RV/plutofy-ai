import { Dispatch, SetStateAction } from "react";
import { INode } from "@/types/workflow";
import SelectCredentials from "./SelectCredentials";

interface NodeCredentialsEditorProps {
  node: INode,
  localData: INode,
  setLocalData: Dispatch<SetStateAction<INode>>,
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>,
}

const NodeCredentialsEditor = ( props: NodeCredentialsEditorProps ) => {
  
  const handleCredentialsChange = (value: string) => {
    props.setLocalData(prev => ({
      ...prev,
      credentials: value
    }))
    props.setHasUnsavedChanges(true);
  }

  return (
    <div className="border-y py-4 my-3">
      <p className="text-xs mb-2">Credentials</p>
      <SelectCredentials 
        value={props.localData.credentials} 
        setValue={(val) => handleCredentialsChange(val)} 
        nodeType={props.node.type ?? ""}
      />
    </div>
  )
}

export default NodeCredentialsEditor;