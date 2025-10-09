import { OutputStructure } from "@/types/agent";
import { cn } from "@/lib/utils";
import OutputStructureBuilder from "@/utils/output-structure-builder.util";


const JsonPreview = ({ outputStructure, className } : { outputStructure: OutputStructure[], className?: string }) => {

  const fields = (OutputStructureBuilder.convertOutputStructureToFields(outputStructure))
  const jsonObject = OutputStructureBuilder.getJsonObjectForPreview(fields)

  return (
    <div className={cn(className)}>
      <pre className="bg-gray-100 dark:bg-background border p-4 text-sm rounded-md overflow-auto">{JSON.stringify(jsonObject, null, 2)}</pre>
    </div>
  )
}

export default JsonPreview;