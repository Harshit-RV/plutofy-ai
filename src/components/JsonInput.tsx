
import { useState } from "react"
import { ButtonCN } from "@/components/ui/buttoncn"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, ChevronDown, ChevronRight } from "lucide-react"
import { Input as InputAnt } from 'antd';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

type Field = {
  id: string
  name: string
  type: string
  fields?: Field[]
  isExpanded?: boolean
}

export default function JsonBuilder() {
  const [fields, setFields] = useState<Field[]>([])

  const addField = (parentId: string | null = null) => {
    const newField: Field = {
      // TODO: add UUID here
      id: Date.now().toString(),
      name: "",
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
        ...updates,
        isExpanded: updates.type === "object" ? true : undefined,
        fields: updates.type === "object" ? field.fields || [] : undefined,
      })),
    )
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

  const renderField = (field: Field, depth = 0) => {
    return (
      <div key={field.id}>
        <div className={`flex gap-1 h-min items-center font-mono`}>
        {/* <div className={`grid grid-cols-[auto,1fr,auto,auto] gap-2 items-center h-7 ${subField ? 'h-7' : ''}`}> */}
          
          {field.type === "object" && (
            <ButtonCN variant="secondary" size="icon" className="h-10 hover:border hover:bg-white" onClick={() => toggleExpand(field.id)}>
              {field.isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </ButtonCN>
          )}
          
          {/* {field.type !== "object" && <div className="" />} */}
          
          <InputAnt
            value={field.name}
            onChange={(e) => updateField(field.id, { name: e.target.value })}
            placeholder="Enter field name"
            // className={`h-7 ring-none outline-none ${subField ? '' : ''}`}
            className="w-full h-10 tracking-widest font-bold shadow-sm font-mono bg-white rounded-sm focus-visible:ring-1 focus-visible:outline-none" 
          />
          
          <Select value={field.type} onValueChange={(value) => updateField(field.id, { type: value })}>
            <SelectTrigger className="w-[120px] h-10 bg-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="object">Object</SelectItem>
            </SelectContent>
          </Select>
          
          <ButtonCN variant="outline" size="sm" className="h-10 text-red-600 hover:text-red-600" onClick={() => removeField(field.id)}>
            <X className="h-4 w-4" />
          </ButtonCN>

        </div>
        {field.type === "object" && field.isExpanded && (
          <div className="flex flex-col ml-8 border-l-2 pl-6 mb-3 border-gray-300 mt-2 gap-1">
            {field.fields && field.fields.map((subField) => renderField(subField, depth + 1))}
            <ButtonCN variant="outline" size="sm" onClick={() => addField(field.id)} className="mt-2 h-8 w-min">
              Add Nested Field
            </ButtonCN>
          </div>
        )}
      </div>
    )
  }

  const getJsonObject = (fields: Field[]): { [key: string]: JsonValue } => {
    return fields.reduce(
      (obj, field) => {
        if (field.name) {
          if (field.type === "object" && field.fields) {
            obj[field.name] = getJsonObject(field.fields)
          } else {
            obj[field.name] = getDefaultValue(field.type)
          }
        }
        return obj
      },
      {} as { [key: string]: JsonValue },
    )
  }

  const getDefaultValue = (type: string): JsonValue => {
    switch (type) {
      case "string":
        return ""
      case "number":
        return 0
      case "boolean":
        return false
      case "object":
        return {}
      default:
        return null
    }
  }

  const jsonObject = getJsonObject(fields)

  return (
    <div className="container mx-auto pt-2 max-w-3xl">
      <div className="space-y-1.5 border bg-gray-100 mb-4 rounded-lg px-4 py-5">
        {fields.map((field) => renderField(field))}
        <ButtonCN onClick={() => addField()} size={'sm'} variant={'outline'} className="px-4 mt-2">
          Add Field
        </ButtonCN>
      </div>
      <div>
        {/* <h2 className="text-xl font-semibold mb-2">JSON Output:</h2> */}
        <pre className="bg-gray-100 border p-4 text-sm rounded-md overflow-auto">{JSON.stringify(jsonObject, null, 2)}</pre>
      </div>
    </div>
  )
}

