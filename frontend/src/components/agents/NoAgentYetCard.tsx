import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { ButtonCN } from "@/components/ui/buttoncn";

const NoAgentYetCard = () => {
  return (
    <Card className="w-full col-span-3">
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
        <Bot className="w-16 h-16 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-800">No agents yet</h2>
        <p className="text-gray-500 pb-2 text-sm">
          Create your first agent to get started
        </p>

        <Link to="/agent/create">
          <ButtonCN className="px-5">Create Agent</ButtonCN>
        </Link>
      </CardContent>
    </Card>
  );
};

export default NoAgentYetCard;