import { Dispatch, SetStateAction } from "react";
import { INode } from "@/types/workflow";
import SelectCredentials from "./SelectCredentials";
import { cn } from "@/lib/utils";

interface NodeCredentialsEditorProps {
  node: INode,
  localData: INode,
  setLocalData: Dispatch<SetStateAction<INode>>,
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>,
  className?: string
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
    <div className={cn("border-t py-4", props.className)}>
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