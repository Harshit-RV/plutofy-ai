import JsonBuilder from "@/components/json-forms/JsonInput"
import { cn } from "@/lib/utils"
import { OutputStructure } from "@/types/agent"
import { INode } from "@/types/workflow"
import { Dispatch, SetStateAction} from "react"

interface JsonBuilderWrappedForWorkflowProps {
  localData: INode,
  setLocalData: Dispatch<SetStateAction<INode>>
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>,
  className?: string
}

const JsonBuilderWrappedForWorkflow = ( props: JsonBuilderWrappedForWorkflowProps ) => {
  const handleDataInputChange = (val: OutputStructure[]) => {
    props.setLocalData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        outputStructure: val
      } 
    }));
    props.setHasUnsavedChanges(true);
  };

  return (
    <div className={cn("border-t pt-3", props.className)}>
      <p className="text-xs">Output Structure</p>
      <JsonBuilder
        // TODO: improve these checks
        outputStructure={(((props.localData?? {}).data ?? {}).outputStructure ?? []) as OutputStructure[]} 
        setOutputStructure={(val) => handleDataInputChange(val)}
        hidePreview
      />
    </div>
  )
}

export default JsonBuilderWrappedForWorkflow