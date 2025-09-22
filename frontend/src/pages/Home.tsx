import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import toast from "react-hot-toast";
import { ButtonCN } from "@/components/ui/buttoncn";
import { deleteAgent, getAgentsByUserId } from "@/utils/agent.utils";
import { useAuth } from "@clerk/clerk-react";
import AgentCardSkeleton from "@/components/agents/AgentCardSkeleton";
import TemplatesSection from "@/components/agents/AgentTemplatesSection";
import AgentCard from "@/components/agents/AgentCard";
import NoAgentYetCard from "@/components/agents/NoAgentYetCard";

export const Home = () => {
  const { getToken } = useAuth();

  const fetchList = async () => {
    const token = await getToken();
    if (!token) return;
    return await getAgentsByUserId(token);
  };

  const onDelete = async (agentId: string) => {
    const token = await getToken();
    if (!token) return;

    await toast.promise(deleteAgent({ agentId: agentId, token: token }), {
      loading: "Deleting...",
      success: <b>Agent Deleted</b>,
      error: <b>Could not delete agent.</b>,
    });

    refetchAgents();
  };

  const {
    data: agents,
    isLoading: agentsLoading,
    refetch: refetchAgents,
  } = useQuery("agents", fetchList);

  return (
    <div className="flex justify-center font-mono min-h-screen bg-gray-100 px-2.5 sm:px-6 md:px-10">
      <div className="py-8 w-full lg:max-w-[1300px]">
        {/* {JSON.stringify(agents)} */}

        <div className="flex justify-between h-8 ">
          <h1 className="font-black text-[21px] sm:text-lg font-poppins mt-0.5 sm:mt-1.5">
            {agentsLoading ? (
              <Skeleton className="w-40 h-6 bg-gray-200"></Skeleton>
            ) : agents?.length == 0 ? (
              "Templates"
            ) : (
              "Your Agents"
            )}
          </h1>
          <div className="flex gap-5">
            <Link to="/agent/create">
              <ButtonCN size={'lg'} className="px-6 sm:px-8 h-9">
                Create
              </ButtonCN>
            </Link>
          </div>
        </div>
        {agents?.length == 0 && (
          <div className="mt-4">
            <TemplatesSection
              collapsible={agents?.length != 0}
              refetch={refetchAgents}
            />
          </div>
        )}

        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {!agentsLoading || agents != undefined ? (
            agents?.length == 0 ? (
              <NoAgentYetCard />
            ) : (
              agents?.map((agent) => (
                <AgentCard
                  key={agent._id}
                  name={agent.name}
                  description={agent.description}
                  agentDocId={agent._id}
                  model={agent.modelName}
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

        {agents?.length != 0 && (
          <div className="mt-8">
            <TemplatesSection
              collapsible={agents?.length != 0}
              refetch={refetchAgents}
            />
          </div>
        )}
      </div>
    </div>
  );
};