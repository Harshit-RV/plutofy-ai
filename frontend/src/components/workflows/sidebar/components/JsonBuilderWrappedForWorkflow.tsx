import JsonBuilder from "@/components/json-forms/JsonInput"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { OutputStructure } from "@/types/agent"
import { INode } from "@/types/workflow"
import { Dispatch, SetStateAction} from "react"

interface JsonBuilderWrappedForWorkflowProps {
  localData: INode,
  title: string,
  description?: string,
  setLocalData: Dispatch<SetStateAction<INode>>
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>,
  className?: string
}

const JsonBuilderWrappedForWorkflow = ( props: JsonBuilderWrappedForWorkflowProps ) => {
  const handleDataInputChange = (val: OutputStructure[]) => {
    const existing = (((props.localData ?? {}).data ?? {}).outputStructure ?? []) as OutputStructure[];
    const isSame = JSON.stringify(existing) === JSON.stringify(val);

    if (isSame) return;

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
          <CardTitle className="flex flex-col">
            <h4 className="text-sm font-semibold">
              {props.title}
            </h4>
            {props.description && (
              <div className="text-xs mt-2 text-gray-500">{props.description}</div>
            )}
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