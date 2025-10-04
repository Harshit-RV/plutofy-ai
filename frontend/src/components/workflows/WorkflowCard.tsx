import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreOutlined } from "@ant-design/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { truncateString } from "@/utils/utils";
import getRelativeTimeFromDate from "@/utils/getRelativeTimeFromDate";

const WorkflowCard = ({
  name,
  description,
  workflowDocId,
  updatedAt,
  onDelete,
}: {
  name: string;
  description: string;
  updatedAt: Date,
  workflowDocId: string;
  onDelete: (agentId: string) => void;
}) => {
  return (
    <Link to={`/workflow/${workflowDocId}`}>
      <Card className="pb-4 h-full flex flex-col justify-between">
        <CardHeader className="pt-6 pb-3">
          <CardTitle className="flex justify-between">
            <h2 className="font-black text-md">{name}</h2>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-[18px]">
                <MoreOutlined />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async (event) => {
                    event.stopPropagation();
                    onDelete(workflowDocId);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        {description ?? (
          <CardContent className="py-0 pb-4">
            <p className="text-sm text-gray-500">{truncateString(description)} </p>
          </CardContent>
        )}
        <CardFooter className="flex gap-4 py-0 w-full justify-between">
          <div className="text-xs text-gray-500">Last updated {getRelativeTimeFromDate(updatedAt)}</div>
          <div className="flex gap-2 bg-gray-50 dark:bg-background border border-gray-200 dark:border-gray-800 rounded-full items-center h-7 px-3 xl:px-4">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <p className="flex items-center text-green-600 font-black text-xs">Active</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default WorkflowCard