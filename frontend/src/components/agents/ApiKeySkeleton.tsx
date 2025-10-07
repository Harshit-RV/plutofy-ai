import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

const ApiKeySkeleton = () => {
  return (
    <TableRow>
      <TableCell className="p-4 pl-5">
        <Skeleton className="w-full max-w-60 h-6 bg-gray-200"></Skeleton>
      </TableCell>
      <TableCell className="p-4">
        <Skeleton className="w-full max-w-24 h-6 bg-gray-200"></Skeleton>
      </TableCell>
      <TableCell className="p-2">
        <Skeleton className="w-full max-w-32 h-6 bg-gray-200"></Skeleton>
      </TableCell>
      <TableCell className="p-2">
        <Skeleton className="w-full max-w-32 h-6 bg-gray-200"></Skeleton>
      </TableCell>
      
      <TableCell className="flex justify-end p-4 pr-4">
        <Skeleton className="w-4 h-6 bg-gray-200"></Skeleton>
      </TableCell>
    </TableRow>
  )
}

export default ApiKeySkeleton;