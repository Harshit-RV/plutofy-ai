import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonCN } from "@/components/ui/buttoncn";
import { AgentProps } from "@/types/agent";
import { createAgent } from "@/utils/agent.utils";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import Helper from "@/utils/helper";
import OutputStructureBuilder from "@/utils/output-structure-builder.util";

const TemplateAgentCard = ({
  data,
  blackCta = false,
  refetch,
}: {
  data: Omit<AgentProps, "userId">;
  blackCta?: boolean;
  refetch: () => void;
}) => {
  const { getToken } = useAuth();

  const onClickUse = async () => {
    const token: string | null = await getToken();
    if (!token) return;

    await toast.promise(createAgent({ agentProps: data, token: token }), {
      loading: "Replicating from template...",
      success: <b>Agent Created</b>,
      error: <b>Could not create agent.</b>,
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
      <CardContent className="py-0 pb-4 px-5">
        <p className="text-[13px] text-gray-500">
          {Helper.truncateString(data.description, 100)}{" "}
        </p>
      </CardContent>
      <CardFooter className="flex gap-4 px-5 pb-4 w-full justify-between">
        <Dialog>
          <DialogTrigger className="w-full">
            <ButtonCN
              variant={"secondary"}
              size={"sm"}
              className=" border-gray-400 w-full"
            >
              {" "}
              Learn More
            </ButtonCN>
          </DialogTrigger>
          <DialogContent className="min-w-[650px] flex flex-col gap-2">
            <DialogHeader className="flex flex-col gap-2">
              <DialogTitle className="text-xl">{data.name}</DialogTitle>
              <DialogDescription>{data.description}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-gray-500 mt-4">Model</h3>
                <div className="bg-gray-100 text-sm py-2 px-4 border rounded-md">
                  {data.modelName}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-gray-500 mt-4">
                  Instruction
                </h3>
                <div className="bg-gray-100 text-sm py-2 px-4 border rounded-md">
                  {data.instruction}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-gray-500 mt-4">
                  Output Structure
                </h3>
                <pre className="bg-gray-100 border p-4 text-sm rounded-md overflow-auto">
                  {JSON.stringify(OutputStructureBuilder.getJsonObjectForPreview(data.outputStructure), null, 2)}
                </pre>
              </div>
            </div>
            <DialogFooter className="mt-2">
              <DialogClose>
                <ButtonCN variant={"outline"}>Cancel</ButtonCN>
              </DialogClose>
              <ButtonCN onClick={onClickUse}>Quick Start</ButtonCN>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ButtonCN
          onClick={onClickUse}
          size={"sm"}
          variant={blackCta ? "default" : "secondary"}
          className="border-gray-300 border w-full"
        >
          Quick Start
        </ButtonCN>
      </CardFooter>
    </Card>
  );
};

export default TemplateAgentCard;
