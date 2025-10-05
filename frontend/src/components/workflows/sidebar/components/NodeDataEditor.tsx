import { Dispatch, SetStateAction, useEffect } from "react";
import SingleInputField from "../views/SingleInputField";
import { INode } from "@/types/workflow";
import { NodeInfo } from "@/workflow-scheme";
import { cn } from "@/lib/utils";
import { OutputStructure } from "@/types/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NodeDataEditorProps {
  nodeInfoFromScheme: NodeInfo,
  node: INode,
  setNodes: Dispatch<SetStateAction<INode[]>>,
  localData: INode,
  setLocalData: Dispatch<SetStateAction<INode>>,
  hasUnsavedChanges: boolean,
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>,
  outputStructure?: OutputStructure[],
  className?: string
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
    <div className={cn(props.className)}>
      <Card>
        <CardHeader className="pt-5 pb-0 px-3 md:px-4">
          <CardTitle className="flex justify-between">
            <h4 className="text-sm font-semibold">
              Data
            </h4>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0 pb-4 px-3 md:px-4">
          {
            props.nodeInfoFromScheme.data.map((inputField, index) => (
              <div key={index} className='mt-3'>
                <p className='text-xs mb-1'>{inputField.displayName}</p>
                <SingleInputField 
                  key={`${index}-${props.nodeInfoFromScheme.type}-${inputField.name}`}
                  type={inputField.type} 
                  value={(props.localData.data ?? {})[inputField.name] ?? ''} 
                  onValueChange={(val) => handleDataInputChange(inputField.name, val)}
                  name={inputField.name} 
                  displayName={inputField.displayName}
                  outputStructure={props.outputStructure}
                />
              </div>
            ))
          }
        </CardContent>
      </Card> 
    </div>
  )
}

export default NodeDataEditor;