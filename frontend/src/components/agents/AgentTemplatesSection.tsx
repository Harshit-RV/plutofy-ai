import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import TemplateAgentCard from "./TemplateAgentCard";
import { ButtonCN } from "@/components/ui/buttoncn";
import { AgentProps } from "@/types/agent";

const AgentTemplatesSection = ({
  collapsible = true,
  refetch,
}: {
  collapsible?: boolean;
  refetch: () => void;
}) => {
  const templateAgents: Omit<AgentProps, "userId">[] = [
    {
      name: "Blockchain Hackathon Idea Generator",
      description: "Returns a good blockchain project idea for a hackathon",
      modelName: "gpt-4o-2024-08-06",
      modelCategory: "OpenAI",
      instruction: "Give me a random project idea for a blockchain hackathon",
      outputStructure: [
        {
          name: "idea",
          type: "object",
          fields: [
            { id: "1738662132509", name: "name", type: "string" },
            {
              id: "1738662137249",
              name: "estimated_time_to_build_in_days",
              type: "number",
            },
            { id: "1738662143387", name: "tech_stack", type: "string" },
            { id: "1738662151411", name: "description", type: "string" },
            {
              id: "1738662155943",
              name: "isBlockchainRelated",
              type: "boolean",
            },
          ],
          id: "67a1e13ecb3dca9f95ad66d4",
        },
        { id: "1738662161978", name: "theme", type: "string", fields: [] },
        { id: "1738662167698", name: "usecase", type: "string", fields: [] },
        {
          id: "1738662171098",
          name: "target_audience",
          type: "string",
          fields: [],
        },
      ],
    },
    {
      name: "Marketing Email Generator",
      description:
        "Creates a persuasive marketing email tailored for your product and audience.",
      modelName: "gpt-4o-2024-08-06",
      modelCategory: "OpenAI",
      instruction: "Write a marketing email for the following product:",
      outputStructure: [
        { id: "1738662132509", name: "subject_line", type: "string" },
        { id: "1738662137249", name: "email_body", type: "string" },
        { id: "1738662143387", name: "call_to_action", type: "string" },
      ],
    },
    {
      name: "Extract Personal Info from Paragraphs",
      description:
        "Extracts personal information such as name, email, and phone number from a given paragraph.",
      modelName: "gpt-4o-2024-08-06",
      modelCategory: "OpenAI",
      instruction: "Extract personal information from the following paragraph:",
      outputStructure: [
        { id: "1738662132509", name: "name", type: "string" },
        { id: "1738662137249", name: "email", type: "string" },
        { id: "1738662143387", name: "phone_number", type: "number" },
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
            {templateAgents.map((agent, index) => (
              <TemplateAgentCard
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
        {templateAgents.map((agent, index) => (
          <TemplateAgentCard
            key={index}
            data={agent}
            blackCta={!collapsible}
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default AgentTemplatesSection;
