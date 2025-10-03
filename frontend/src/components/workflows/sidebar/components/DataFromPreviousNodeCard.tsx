import { Card, CardHeader } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import JsonPreview from "@/components/json-forms/JsonPreview"
import { OutputStructure } from "@/types/agent"
import { INode } from "@/types/workflow"
import { Dispatch, SetStateAction } from "react"
import { Switch } from "@/components/ui/switch"

interface DataFromPreviousNodeCardProps {
  previousNodeData: INode,
  localData: INode,
  setLocalData: Dispatch<SetStateAction<INode>>,
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>,
}

const DataFromPreviousNodeCard = ( props: DataFromPreviousNodeCardProps) => {
  
  const handleDataInputChange = (val: boolean) => {
    props.setLocalData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        getDataFromPreviousNode: val
      } 
    }));
    props.setHasUnsavedChanges(true);
  };

  return (
    <Card className="">
      <CardHeader className="pt-5 pb-3 px-3 md:px-4">
        <CardTitle className="flex justify-between">
          <h4 className="text-sm font-semibold">
            Data from previous node
          </h4>
          <Switch
            checked={((props.localData?.data || {}).getDataFromPreviousNode || false) as boolean}
            onCheckedChange={handleDataInputChange}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 pb-2 px-3 md:px-4">
        {
          ((props.localData?.data || {}).getDataFromPreviousNode || false) as boolean && (
            <JsonPreview className="mb-2" outputStructure={((props.previousNodeData?.data || {}).outputStructure || []) as OutputStructure[]}/>
          )
        }
      </CardContent>
    </Card> 
  )
}

export default DataFromPreviousNodeCard