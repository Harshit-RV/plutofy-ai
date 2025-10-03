import { Dispatch, SetStateAction } from "react";
import { INode } from "@/types/workflow";
import SelectCredentials from "./SelectCredentials";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className={cn(props.className)}>
      <Card className="">
        <CardHeader className="pt-5 pb-3 px-3 md:px-4">
          <CardTitle className="flex justify-between">
            <h4 className="text-sm font-semibold">
              Credentials
            </h4>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0 pb-4 px-3 md:px-4">
          <SelectCredentials
            value={props.localData.credentials} 
            setValue={(val) => handleCredentialsChange(val)} 
            nodeType={props.node.type ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default NodeCredentialsEditor;