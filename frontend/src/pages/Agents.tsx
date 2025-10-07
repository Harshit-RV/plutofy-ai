import { Link } from "react-router-dom";
import { useQueryClient } from "react-query";
import { ButtonCN } from "@/components/ui/buttoncn";
import { useAuth } from "@clerk/clerk-react";
import PageWrapper from "@/components/common/PageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ApiKeysSection from "@/components/agents/tab-sections/ApiKeysSection";
import { FaChevronDown } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AGENTS_BASE_ROUTE } from "@/config";
import ApiCreateDialog from "@/components/api-keys/ApiCreateDialog";
import AgentListSection from "@/components/agents/tab-sections/AgentListSection";

const Agents = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return (
    <PageWrapper>
      <div className="py-8 w-full lg:max-w-[1300px]">

        <div className="flex justify-between h-8 ">
          <h1 className="font-black text-[21px] sm:text-lg font-poppins mt-0.5 sm:mt-1.5">
            Your Agents
          </h1>
          
          <div className="flex gap-0">
            <Link to={`/${AGENTS_BASE_ROUTE}/create`}>
              <ButtonCN size={'lg'} className="px-6 sm:px-8 h-9 rounded-e-none border-e">
                Create
              </ButtonCN>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <ButtonCN className="h-9 px-2 rounded-s-none" size="lg" aria-label="More Options">
                  <FaChevronDown />
                </ButtonCN>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-none p-0 pt-2">
                <ApiCreateDialog getToken={getToken} refetchApiKeys={() => queryClient.invalidateQueries({ queryKey: ['apiKeys'] })} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="agents" className="mt-4">
          <TabsList className="border bg-gray-300 dark:bg-gray-900">
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="agents">
            <AgentListSection />
          </TabsContent>
          <TabsContent value="api-keys">
            <ApiKeysSection />
          </TabsContent>
        </Tabs>

      </div>
    </PageWrapper>
  );
};

export default Agents;