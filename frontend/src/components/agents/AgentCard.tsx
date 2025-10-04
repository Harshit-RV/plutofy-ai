import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { truncateString } from "@/utils/utils";
import { MoreOutlined } from "@ant-design/icons";

const AgentCard = ({
  name,
  description,
  agentDocId,
  model,
  onDelete,
}: {
  name: string;
  description: string;
  agentDocId: string;
  model: string;
  onDelete: (agentId: string) => void;
}) => {
  return (
    <Link to={`/agent/${agentDocId}`}>
    <Card className="pb-5 h-full flex flex-col justify-between">
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
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(agentDocId);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 pb-4">
        <p className="text-sm text-gray-500">{truncateString(description)} </p>
      </CardContent>
      <CardFooter className="flex gap-4 py-0 w-full justify-between">
        <p className="bg-gray-100 dark:bg-background border border-gray-200 dark:border-gray-800 px-3 xl:px-4 rounded-full flex items-center justify-center text-xs h-7">{model}</p>
        <div className="flex gap-2 bg-gray-50 border border-gray-200 dark:bg-background dark:border-gray-800 rounded-full items-center h-7 px-3 xl:px-4">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <p className="flex items-center text-green-600 font-black text-xs">Active</p>
        </div>
      </CardFooter>
    </Card>
    </Link>
  );
};

export default AgentCard;