import { ButtonCN } from "@/components/ui/buttoncn";
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkflowService from "@/utils/workflow.util";
import AgentCardSkeleton from "@/components/agents/AgentCardSkeleton";
import toast from "react-hot-toast";
import WorkflowTemplates from "@/components/workflows/WorkflowTemplates";
import NoWorkflowYetCard from "@/components/workflows/NoWorkflowYetCard";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import PageWrapper from "@/components/PageWrapper";

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
   <PageWrapper>
      <div className="py-8 w-full lg:max-w-[1300px]">
        {/* {JSON.stringify(agents)} */}

        <div className="flex justify-between h-8 ">
          <h1 className="font-black text-[21px] sm:text-lg font-poppins mt-0.5 sm:mt-1.5">
            {workflowsLoading ? (
              <Skeleton className="w-40 h-6 bg-gray-200"></Skeleton>
            ) : "Your Workflows"}
          </h1>
          <div className="flex">
            <ButtonCN onClick={createNewWorkflow} size={'lg'} className="px-6 sm:px-8 h-9">
              Create
            </ButtonCN>
          </div>
        </div>
       
        <Tabs defaultValue="workflows" className="mt-4">
          <TabsList className="border bg-gray-300 dark:bg-gray-900">
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
          <TabsContent value="credentials" className="mt-4 text-sm text-gray-700 dark:text-foreground">Coming soon..</TabsContent>
          <TabsContent value="executions" className="mt-4 text-sm text-gray-700 dark:text-foreground">Coming soon..</TabsContent>
        </Tabs>
      </div>
   </PageWrapper>
  )
}

export default Workflows