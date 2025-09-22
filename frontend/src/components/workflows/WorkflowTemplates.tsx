import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { ButtonCN } from "@/components/ui/buttoncn";
import { WorkflowProps } from "@/types/workflow";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import WorkflowService from "@/utils/workflow.util";
import { truncateString } from "@/utils/utils";


const WorkflowTemplates = ({
  collapsible = true,
  refetch,
}: {
  collapsible?: boolean;
  refetch: () => void;
}) => {
  const templateWorkflows: WorkflowProps[] = [
    {
      name: "Simple Workflow",
      description: "Uses Telegram, AI agent, and Mail nodes with Webhook trigger",
      nodes: [
        { id: '1', position: { x: 0, y: 0 }, data: {}, type: 'webhookTriggerNode', },
        { id: '2', position: { x: 100, y: 0 }, data: {}, type: 'emailNode', },
        { id: '3', position: { x: 100, y: 100 }, data: {}, type: 'telegramNode', },
        { id: '4', position: { x: 200, y: 100 }, data: {}, type: 'agentNode', },
        { id: '5', position: { x: 200, y: 200 }, data: {}, type: 'llmNode', },
        { id: '6', position: { x: 200, y: 300 }, data: {}, type: 'conditionNode', },
      ],
      connections: [
        { id: 'e1-2', source: '1', target: '2' }
      ],
    },
  ];

  if (collapsible) {
    return (
      <Collapsible className="w-full space-y-5 ">
        <CollapsibleTrigger asChild>
          <div className="flex items-center space-x-4 py-1 rounded-xl shadow-sm border-2 border-gray-200 hover:border-gray-300 hover:cursor-pointer px-4">
            <h1 className="font-black text-md font-poppins text-gray-600">
              Templates
            </h1>
            <ButtonCN variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </ButtonCN>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col lg:flex-row gap-4">
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {templateWorkflows.map((agent, index) => (
              <TemplateWorkflowCard
                key={index}
                data={agent}
                blackCta={!collapsible}
                refetch={refetch}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {templateWorkflows.map((workflow, index) => (
          <TemplateWorkflowCard
            key={index}
            data={workflow}
            blackCta={!collapsible}
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
};


const TemplateWorkflowCard = ({
  data,
  blackCta = false,
  refetch,
}: {
  data: WorkflowProps;
  blackCta?: boolean;
  refetch: () => void;
}) => {
  const { getToken } = useAuth();

  const onClickUse = async () => {
    const token: string | null = await getToken();
    if (!token) return;

    await toast.promise(WorkflowService.createWorkflow(data, token), {
      loading: "Replicating from template...",
      success: <b>Workflow Created</b>,
      error: <b>Could not create workflow.</b>,
    });
    refetch();
  };

  return (
    <Card className="overflow-hidden flex flex-col justify-between">
      <div className=" h-8 w-full rounded-t-xl bg-gray-100 bg-gradient-to-br from-gray-700 via-gray-500 to-gray-700"></div>
      <CardHeader className="pt-5 pb-3 px-5">
        <CardTitle className="flex justify-between">
          <h2 className="font-black text-[16px]">{data.name}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 pb-3 px-5">
        <p className="text-[13px] text-gray-500">
          {truncateString(data.description ?? "", 100)}{" "}
        </p>
      </CardContent>
      <CardFooter className="flex gap-4 px-5 pb-4 w-full justify-end">
        <ButtonCN
          onClick={onClickUse}
          size={"sm"}
          variant={blackCta ? "default" : "secondary"}
          className="border-gray-300 h-7 border max-w-60"
        >
          Quick Start
        </ButtonCN>
      </CardFooter>
    </Card>
  );
};

export default WorkflowTemplates;
