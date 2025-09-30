import JsonBuilder from "@/components/json-forms/JsonInput"
import { OutputStructure } from "@/types/agent"
import { INode } from "@/types/workflow"
import { Dispatch, SetStateAction} from "react"

interface JsonBuilderWrappedForWorkflowProps {
  localData: INode,
  setLocalData: Dispatch<SetStateAction<INode>>
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>
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
    <div className="border-y py-4 my-3">
      <p className="text-xs">Output Structure</p>
      <JsonBuilder
        // TODO: improve these checks
        outputStructure={(((props.localData?? {}).data ?? {}).outputStructure ?? []) as OutputStructure[]} 
        setOutputStructure={(val) => handleDataInputChange(val)}
      />
    </div>
  )
}

export default JsonBuilderWrappedForWorkflow