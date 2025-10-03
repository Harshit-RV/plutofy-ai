import JsonBuilder from "@/components/json-forms/JsonInput"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
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
    <div className={cn(props.className)}>
      <Card className="">
        <CardHeader className="pt-5 pb-3 px-3 md:px-4">
          <CardTitle className="flex justify-between">
            <h4 className="text-sm font-semibold">
              Output Structure
            </h4>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0 pb-4 px-3 md:px-4">
          <JsonBuilder
            // TODO: improve these checks
            outputStructure={(((props.localData?? {}).data ?? {}).outputStructure ?? []) as OutputStructure[]} 
            setOutputStructure={(val) => handleDataInputChange(val)}
            hidePreview
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default JsonBuilderWrappedForWorkflow