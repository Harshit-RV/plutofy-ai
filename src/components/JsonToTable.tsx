import type React from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

type JsonValue = string | number | boolean | null | JsonObject | JsonArray
type JsonObject = { [key: string]: JsonValue }
type JsonArray = JsonValue[]

interface JsonTableProps {
  data: JSON
}

const JsonTable: React.FC<JsonTableProps> = ({ data }) => {
  const renderValue = (value: JsonValue): React.ReactNode => {
    if (typeof value === "object" && value !== null) {
      return <JsonTable data={JSON.parse(JSON.stringify(value))} />
    }
    return String(value)
  }

  const renderTableRows = (obj: JsonObject | JsonArray) => {
    if (Array.isArray(obj)) {
      return obj.map((item, index) => (
        <TableRow key={index}>
          <TableCell className="font-bold">{index+1}</TableCell>
          <TableCell>{renderValue(item)}</TableCell>
        </TableRow>
      ))
    }

    return Object.entries(obj).map(([key, value]) => (
      <TableRow key={key}>
        <TableCell className="font-semibold text-gray-500 bg-gray-50 px-3">{key}</TableCell>
        <TableCell className="py-3 pl-3">{renderValue(value)}</TableCell>
      </TableRow>
    ))
  }

  if (typeof data !== "object" || data === null) {
    return <span>{String(data)}</span>
  }

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-4">
        <Table>
          <TableBody>{renderTableRows(JSON.parse(JSON.stringify(data)))}</TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default JsonTable