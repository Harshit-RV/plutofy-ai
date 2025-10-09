import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import AgentCardSkeleton from "@/components/agents/AgentCardSkeleton";
import TemplatesSection from "@/components/agents/AgentTemplatesSection";
import AgentCard from "@/components/agents/AgentCard";
import NoAgentYetCard from "@/components/agents/NoAgentYetCard";
import AgentService from "@/services/agent.service";

const AgentListSection = () => {
  const { getToken } = useAuth();

  const fetchList = async () => {
    const token = await getToken();
    if (!token) return;
    return await AgentService.getAgentsByUserId(token);
  };

  const onDelete = async (agentId: string) => {
    const token = await getToken();
    if (!token) return;

    await toast.promise(AgentService.deleteAgent({ agentId: agentId, token: token }), {
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
    <div>
        {agentsLoading ? (
          <Skeleton className="w-40 h-6 bg-gray-200"></Skeleton>
        ) : agents?.length == 0 && (
          <h1 className="font-black text-sm font-poppins mt-2 sm:mt-4">
            TEMPLATES
          </h1>
        )}

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
  );
};

export default AgentListSection;