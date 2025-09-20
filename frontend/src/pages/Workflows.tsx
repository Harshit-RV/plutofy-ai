import { ButtonCN } from "@/components/ui/buttoncn";
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { NoAgentYetCard } from "./Home";
import { FaChevronDown } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkflowService from "@/utils/workflow.util";
import { AgentCardSkeleton } from "@/components/AgentCardSkeleton";
import { MoreOutlined } from "@ant-design/icons";
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
import { truncateString } from "@/utils/utils";

const Workflows = () => {
  const { getToken } = useAuth();

  const fetchList = async () => {
    const token = await getToken();
    if (!token) return;
    await new Promise((r) =>  setTimeout(r, 4000))
    return await WorkflowService.getAllWorkflowsByUser(token);
  };

  // const onDelete = async (agentId: string) => {
  //   const token = await getToken();
  //   if (!token) return;

  //   // await toast.promise(deleteAgent({ agentId: agentId, token: token }), {
  //   //   loading: "Deleting...",
  //   //   success: <b>Agent Deleted</b>,
  //   //   error: <b>Could not delete agent.</b>,
  //   // });

  //   refetchWorkflows();
  // };

  const {
    data: workflows,
    isLoading: workflowsLoading,
    // refetch: refetchWorkflows,
  } = useQuery("workflows", fetchList);


  return (
    <div className="flex justify-center font-mono min-h-screen bg-gray-100 px-2.5 sm:px-6 md:px-10">
      <div className="py-8 w-full lg:max-w-[1300px]">
        {/* {JSON.stringify(agents)} */}

        <div className="flex justify-between h-8 ">
          <h1 className="font-black text-[21px] sm:text-lg font-poppins mt-0.5 sm:mt-1.5">
            {workflowsLoading ? (
              <Skeleton className="w-40 h-6 bg-gray-200"></Skeleton>
            ) : workflows?.length == 0 ? (
              "Templates"
            ) : (
              "Your Workflows"
            )}
          </h1>
          <div className="flex">
            <Link to="/workflow/create">
              <ButtonCN size={'lg'} className="px-6 sm:px-8 h-9 rounded-r-none">
                Create
              </ButtonCN>
            </Link>
            <ButtonCN size={'lg'} className="px-2 h-9 border-l-[0.5px] border-white rounded-l-none">
              <FaChevronDown />
            </ButtonCN>
          </div>
        </div>

        <div className="mt-4">
          <Tabs defaultValue="workflows" className="w-[400px]">
            <TabsList className="border">
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="executions">Executions</TabsTrigger>
            </TabsList>
            <TabsContent value="workflows">Make changes to your account here.</TabsContent>
            <TabsContent value="credentials">Change your password here.</TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5">
          {!workflowsLoading || workflows != undefined ? (
            workflows?.length == 0 ? (
              <NoAgentYetCard />
            ) : (
              workflows?.map((workflow) => (
                <WorkflowCard 
                  name={workflow.name} 
                  description={workflow._id as string} 
                  workflowDocId={workflow._id as string} 
                  model={""} 
                  onDelete={() => {}}           
                />
              ))
            )
          ) : (
            <>
              <AgentCardSkeleton />
              <AgentCardSkeleton />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const WorkflowCard = ({
  name,
  description,
  workflowDocId,
  model,
  onDelete,
}: {
  name: string;
  description: string;
  workflowDocId: string;
  model: string;
  onDelete: (agentId: string) => void;
}) => {
  return (
    <Link to={`/workflow/${workflowDocId}`}>
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
                    onDelete(workflowDocId);
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
          <p className="bg-gray-100 border border-gray-200 px-3 xl:px-4 rounded-full flex items-center justify-center text-xs h-7">{model}</p>
          <div className="flex gap-2 bg-gray-50 border border-gray-200 rounded-full items-center h-7 px-3 xl:px-4">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <p className="flex items-center text-green-600 font-black text-xs">Active</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default Workflows