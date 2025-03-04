import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ButtonCN } from "@/components/ui/buttoncn";
import { truncateString } from "@/utils/truncateString";
import { AgentProps } from "@/types/agent";
import { createAgent } from "@/utils/agent.utils";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

const TemplateAgentCard = ({ data, refetch } : { data: Omit<AgentProps, "userId">, refetch: () => void }) => {
  const { getToken } = useAuth();
  
  const onClickUse = async () => {
    const token: string | null = await getToken();
    if (!token) return;

    await toast.promise(
        createAgent({ agentProps: data, token: token }),
        {
          loading: 'Replicating from template...',
          success: <b>Agent Created</b>,
          error: <b>Could not create agent.</b>,
        }
    );
    refetch();
  }

  return (
      <Card className="hover:cursor-pointer overflow-hidden">
          <div className=' h-8 w-full rounded-t-xl bg-gray-100 bg-gradient-to-br from-gray-700 via-gray-500 to-gray-700'>
          </div>
          <CardHeader className="pt-5 pb-3 px-5">
              <CardTitle className="flex justify-between">
                  <h2 className="font-black text-[16px]">{data.name}</h2>
              </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-4 px-5">
              <p className="text-[13px] text-gray-500">{truncateString(data.description)} </p>
          </CardContent>
          <CardFooter className="flex gap-4 px-5 pb-4 w-full justify-between">
              <ButtonCN 
                  onClick={(event) => {
                      event.stopPropagation();
                  }}
                  variant={'secondary'} 
                  size={'sm'} 
                  className=" border-gray-400 w-full px-4 sm:px-7 h-7"
              > Learn More</ButtonCN>

              <ButtonCN 
                  onClick={onClickUse}
                  size={'sm'} 
                  variant={'secondary'} 
                  className="border-gray-400 w-full px-4 sm:px-7 h-7"
              >Quick Start</ButtonCN>
          </CardFooter>
      </Card>
  )
}

export default TemplateAgentCard;