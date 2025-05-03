import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { MoreOutlined } from "@ant-design/icons";
// import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { ButtonCN } from "@/components/ui/buttoncn";
import { deleteAgent, getAgentsByUserId } from "@/utils/agent.utils";
import { useAuth } from "@clerk/clerk-react";
import { AgentCardSkeleton } from "@/components/AgentCardSkeleton";
// import { ConnectToAgentDialogBox } from "@/components/ConnectToAgentDialogBox";

import { truncateString } from "@/utils/utils";
import TemplatesSection from "@/components/TemplatesSection";

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
            <Link to="/create">
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
    <Card>
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
      <CardFooter className="flex gap-4 pb-4 w-full justify-between">
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

const NoAgentYetCard = () => {
  return (
    <Card className="w-full col-span-2">
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
        <Bot className="w-16 h-16 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-800">No agents yet</h2>
        <p className="text-gray-500 pb-2 text-sm">
          Create your first agent to get started
        </p>

        <Link to="/create">
          <ButtonCN className="px-5">Create Agent</ButtonCN>
        </Link>
      </CardContent>
    </Card>
  );
};
