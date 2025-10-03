
import { useEffect, useState } from "react"
import { ButtonCN } from "@/components/ui/buttoncn"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, ChevronDown, ChevronRight } from "lucide-react"
import { Input as InputAnt } from 'antd';
import { OutputStructure } from "@/types/agent";
import JsonPreview from "./JsonPreview";
import convertOutputStructureToFields from "@/utils/convertOutputStructureToFields";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

export type Field = {
  id: string
  name: string
  type: string
  fields?: Field[]
  isExpanded?: boolean
}


export default function JsonBuilder( 
  { outputStructure, setOutputStructure, hidePreview = false }
  : { outputStructure:OutputStructure[], setOutputStructure : (outputStructure: OutputStructure[]) => void, hidePreview?: boolean } 
) {
  
  const [fields, setFields] = useState<Field[]>(convertOutputStructureToFields(outputStructure))

  const addField = (parentId: string | null = null, name: string = "") => {
    const newField: Field = {
      // TODO: add UUID here
      id: Date.now().toString(),
      name: name ? name : "",
      type: "string",
      isExpanded: true,
    }

    if (parentId === null) {
      setFields((prev) => [...prev, newField])
    } else {
      setFields((prev) =>
        updateFieldsRecursively(prev, parentId, (field) => ({
          ...field,
          fields: [...(field.fields || []), newField],
        })),
      )
    }
  }

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields((prev) =>
      updateFieldsRecursively(prev, id, (field) => ({
        ...field,
        fields: undefined,
        ...updates,
      })),
    )
    // if ((updates.fields == undefined || updates.fields.length == 0) && (updates.type === "array" || updates.type === "object")){
    //   addField(id, updates.type === "array" ? "array<child>" : "")
    // }
    // if (updates.type === "object") {
    //   if (updates.fields == undefined || updates.fields.length === 0){
    //     addField(id)
    //   }
    // }

  }

  const removeField = (id: string) => {
    setFields((prev) => removeFieldRecursively(prev, id))
  }

  const updateFieldsRecursively = (fields: Field[], id: string, updateFn: (field: Field) => Field): Field[] => {
    return fields.map((field) => {
      if (field.id === id) {
        return updateFn(field)
      }
      if (field.fields) {
        return {
          ...field,
          fields: updateFieldsRecursively(field.fields, id, updateFn),
        }
      }
      return field
    })
  }

  const removeFieldRecursively = (fields: Field[], id: string): Field[] => {
    return fields
      .filter((field) => field.id !== id)
      .map((field) => {
        if (field.fields) {
          return {
            ...field,
            fields: removeFieldRecursively(field.fields, id),
          }
        }
        return field
      })
  }

  const toggleExpand = (id: string) => {
    setFields((prev) =>
      updateFieldsRecursively(prev, id, (field) => ({
        ...field,
        isExpanded: !field.isExpanded,
      })),
    )
  }

  const convertFieldsToOutputStructure = (fields: Field[]): OutputStructure[] => {
    return fields.map(({ id, name, type, fields }) => ({
      id,
      name,
      type,
      fields: fields ? convertFieldsToOutputStructure(fields) : type == "array" ? [{ id: Date.now().toString(), name: "", type: "string" }] : undefined,
    }));
  };

  useEffect(() => {
    const outputStructure: OutputStructure[] = convertFieldsToOutputStructure(fields);
    setOutputStructure(outputStructure);
    console.log('fields changed')
  }, [fields])

  const renderField = (field: Field, depth = 0, isArraySubfield = false) => {
    return (
      <div key={field.id}>
        <div className={`flex gap-1 h-min items-center font-mono`}>
          
         
          
          {/* {field.type !== "object" && <div className="" />} */}
          {isArraySubfield && <div className="text-nowrap font-black text-gray-500 px-3 tracking-widest text-sm"> array of </div>}
          
          {(field.type === "object" || field.type === "array") && (
            <ButtonCN variant="secondary" size="icon" className="h-10 hover:border hover:bg-white" onClick={() => toggleExpand(field.id)}>
              {field.isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </ButtonCN>
          )}

          {!isArraySubfield && <InputAnt
            value={field.name}
            onChange={(e) => updateField(field.id, { name: e.target.value })}
            placeholder="Enter field name"
            className="w-full h-10 tracking-widest font-bold shadow-sm font-mono bg-white rounded-sm focus-visible:ring-1 focus-visible:outline-none" 
          />}
          
          <Select value={field.type} onValueChange={(value) => updateField(field.id, { type: value })}>
            <SelectTrigger className="w-[120px] h-10 bg-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="object">Object</SelectItem>
              <SelectItem value="array">Array</SelectItem>
            </SelectContent>
          </Select>
          
          {!isArraySubfield && (
            <ButtonCN variant="outline" size="sm" className="h-10 text-red-600 hover:text-red-600" onClick={() => removeField(field.id)}>
              <X className="h-4 w-4" /> 
            </ButtonCN>
          )}

        </div>
        
        {(field.type === "object" || field.type === "array") && field.isExpanded && (
          <div className="flex flex-col ml-8 border-l-2 pl-4 mb-3 border-gray-300 mt-2 gap-1">
            {field.fields && field.fields.map((subField) => renderField(subField, depth + 1, field.type == "array"))}
            
            {field.type === "object" ? (
              <ButtonCN variant="outline" size="sm" onClick={() => addField(field.id)} className="mt-2 h-8 w-min">
                Add Nested Field
              </ButtonCN>
            ) : field.fields == undefined || field.fields.length == 0 ? (
              <ButtonCN variant="outline" size="sm" onClick={() => addField(field.id, "array<child>")} className="mt-2 h-8 w-min">
                Add Array Element Definition
              </ButtonCN>
            ) : null}
          </div>
        )}
      </div>
    )
  }


  return (
    <div className="container mx-auto pt-2 max-w-3xl">
      <div className="space-y-1.5 border mb-4 bg-gray-100 rounded-lg px-4 py-5">
        {fields.map((field) => renderField(field))}
        <ButtonCN onClick={() => addField()} size={'sm'} variant={'outline'} className="px-4 mt-2">
          Add Field
        </ButtonCN>
      </div>
      
      {
        !hidePreview && <JsonPreview outputStructure={outputStructure}/>
      }
      
    </div>
  )
}