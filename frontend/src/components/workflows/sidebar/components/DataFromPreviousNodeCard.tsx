import { Card, CardHeader } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import JsonPreview from "@/components/json-forms/JsonPreview"
import { OutputStructure } from "@/types/agent"
import { INode } from "@/types/workflow"
import { cn } from "@/lib/utils"
import { ButtonCN } from "@/components/ui/buttoncn"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface DataFromPreviousNodeCardProps {
  outputStructure: OutputStructure[],
  localData: INode,
  className?: string
}

const DataFromPreviousNodeCard = ( props: DataFromPreviousNodeCardProps) => {
  
  const [ isExpanded, setIsExpanded ] = useState(true);
  
  return (
    <Card className={cn(props.className)}>
      <CardHeader className="pt-5 pb-3 px-3 md:px-4">
        <CardTitle className="flex gap-2 items-center">
          <ButtonCN variant="secondary" size="icon" className="size-6 border hover:bg-background" onClick={() => setIsExpanded((val) => !val)}>
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </ButtonCN>
          <h4 className="text-sm font-semibold">
            Data from previous node
          </h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 pb-2 px-3 md:px-4">
        {
          isExpanded && <JsonPreview className="mb-2" outputStructure={props.outputStructure}/>
        }
      </CardContent>
    </Card> 
  )
}

export default DataFromPreviousNodeCard