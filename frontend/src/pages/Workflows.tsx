import { ButtonCN } from "@/components/ui/buttoncn";
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaProjectDiagram } from "react-icons/fa";
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
import toast from "react-hot-toast";
import getRelativeTimeFromDate from "@/utils/getRelativeTimeFromDate";
import WorkflowTemplates from "@/components/WorkflowTemplates";

const Workflows = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchList = async () => {
    const token = await getToken();
    if (!token) return;
    return await WorkflowService.getAllWorkflowsByUser(token);
  };

  const createNewWorkflow = async () => {
    const token = await getToken();
    if (!token) return;

    const newWorkflow = await WorkflowService.createWorkflow({
      name: `Untitled Workflow #${(workflows?.length ?? 0) + 1}`,
      nodes: [],
      connections: [],
    }, token);

    navigate(`/workflow/${newWorkflow._id}`)
  }

  const onDelete = async (workflowDocId: string) => {
    const token = await getToken();
    if (!token) return;

    await toast.promise(WorkflowService.deleteWorkflow(workflowDocId, token), {
      loading: "Deleting...",
      success: <b>Workflow Deleted</b>,
      error: <b>Could not delete workflow.</b>,
    });

    refetchWorkflows();
  };

  const {
    data: workflows,
    isLoading: workflowsLoading,
    refetch: refetchWorkflows,
  } = useQuery("workflows", fetchList);


  return (
    <div className="flex justify-center font-mono min-h-screen bg-gray-100 px-2.5 sm:px-6 md:px-10">
      <div className="py-8 w-full lg:max-w-[1300px]">
        {/* {JSON.stringify(agents)} */}

        <div className="flex justify-between h-8 ">
          <h1 className="font-black text-[21px] sm:text-lg font-poppins mt-0.5 sm:mt-1.5">
            {workflowsLoading ? (
              <Skeleton className="w-40 h-6 bg-gray-200"></Skeleton>
            ) : "Your Workflows"}
          </h1>
          <div className="flex">
            <ButtonCN onClick={createNewWorkflow} size={'lg'} className="px-6 sm:px-8 h-9 rounded-r-none">
              Create
            </ButtonCN>
            <ButtonCN size={'lg'} className="px-2 h-9 border-l-[0.5px] border-white rounded-l-none">
              <FaChevronDown />
            </ButtonCN>
          </div>
        </div>
       
        <Tabs defaultValue="workflows" className="mt-4">
          <TabsList className="border bg-gray-300">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workflows">
            {workflows?.length == 0 && (
              <div className="mt-4">
                <p className="mb-2 font-bold">Templates</p>
                <WorkflowTemplates
                  collapsible={workflows?.length != 0}
                  refetch={refetchWorkflows}
                />
              </div>
            )}
            <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {!workflowsLoading || workflows != undefined ? (
                workflows?.length == 0 ? (
                  <NoWorkflowYetCard createNewWorkflow={createNewWorkflow}/>
                ) : (
                  workflows?.map((workflow, index) => (
                    <WorkflowCard 
                      key={index}
                      name={workflow.name} 
                      description={""} 
                      workflowDocId={workflow._id as string} 
                      updatedAt={workflow.updatedAt}
                      onDelete={onDelete}         
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
            {workflows?.length != 0 && (
              <div className="mt-6">
                <WorkflowTemplates
                  collapsible={workflows?.length != 0}
                  refetch={refetchWorkflows}
                />
              </div>
            )}
          </TabsContent>
          <TabsContent value="credentials" className="mt-4 text-sm text-gray-700">Coming soon..</TabsContent>
          <TabsContent value="executions" className="mt-4 text-sm text-gray-700">Coming soon..</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export const WorkflowCard = ({
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
          <div className="flex gap-2 bg-gray-50 border border-gray-200 rounded-full items-center h-7 px-3 xl:px-4">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <p className="flex items-center text-green-600 font-black text-xs">Active</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export const NoWorkflowYetCard = ({ createNewWorkflow } : { createNewWorkflow: () => void }) => {
  return (
    <Card className="w-full col-span-3">
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
        <FaProjectDiagram className="w-16 h-16 text-gray-400" />
        
        <h2 className="text-xl font-semibold text-gray-800">No workflows yet</h2>
        <p className="text-gray-500 pb-2 text-sm">
          Create your first workflow to get started
        </p>

        <ButtonCN onClick={createNewWorkflow} className="px-5">Create Workflow</ButtonCN>
      </CardContent>
    </Card>
  );
};

export default Workflows