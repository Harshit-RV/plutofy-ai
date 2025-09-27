import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { FaProjectDiagram } from "react-icons/fa";
import { ButtonCN } from "@/components/ui/buttoncn";

const NoWorkflowYetCard = ({ createNewWorkflow } : { createNewWorkflow: () => void }) => {
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

export default NoWorkflowYetCard
