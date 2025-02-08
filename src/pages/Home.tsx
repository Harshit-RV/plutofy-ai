import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
  
import { Button } from "antd"
import { Bot } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { MoreOutlined } from '@ant-design/icons';
// import { useAuth } from "@clerk/clerk-react";
import { useQuery } from 'react-query'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../components/ui/dropdown-menu"
import toast from "react-hot-toast";
import { ButtonCN } from "@/components/ui/buttoncn";
import { deleteAgent, getAgentsByUserId } from "@/utils/agent.utils";
import { useAuth } from "@clerk/clerk-react";
import { AgentCardSkeleton } from "@/components/AgentCardSkeleton";
import { ConnectToAgentDialogBox } from "@/components/ConnectToAgentDialogBox";

export const Home = () => {
    const { getToken } = useAuth();

    const fetchList = async () => {
        const token = await getToken();
        if (!token) return;
        return await getAgentsByUserId(token);
    }

    const onDelete = async ( agentId: string) => {
        const token = await getToken();
        if (!token) return;

        await toast.promise(
            deleteAgent({ agentId: agentId, token: token }),
             {
               loading: 'Deleting...',
               success: <b>Agent Deleted</b>,
               error: <b>Could not delete agent.</b>,
             }
           );

        refetchAgents();
    }

    const { data: agents, isLoading: agentsLoading, refetch: refetchAgents } = useQuery('agents', fetchList);

    return (
        <div className='flex justify-center font-mono min-h-screen bg-gray-100 px-2.5 sm:px-6 md:px-10'>
           
            <div className="py-8 sm:py-9 w-full lg:w-[1100px]">
                {/* {JSON.stringify(agents)} */}

                <div className="flex justify-between h-8 ">
                    <h1 className='font-black text-[21px] sm:text-xl font-poppins mt-0.5 sm:mt-1.5'>Your Agents</h1>
                    <div className="flex gap-5">
                        <Link to='/create'>
                            <Button type="primary" size="large" className="px-6 sm:px-8 h-9">Create</Button>
                            {/* <ButtonCN variant={'outline'} size={'lg'} className="text-md h-9">Create</ButtonCN> */}
                        </Link>
                    </div>
                </div>
                

                <div className="mt-6 sm:mt-7 grid md:grid-cols-2 gap-5">
                {
                    !agentsLoading || agents != undefined
                    ?
                        agents?.length == 0 
                        ? <NoAgentYetCard />
                        : agents?.map((agent) => (
                            <AgentCard 
                                name={agent.name} 
                                description={agent.description}
                                agentDocId={agent._id}
                                onDelete={onDelete}
                            />
                        )
                    ) 
                    : 
                    <>
                       <AgentCardSkeleton />
                       <AgentCardSkeleton />
                    </>
                }
                </div>
            </div>
        </div>
    )
}

function truncateString(str: string): string {
    return str.length > 50 ? str.slice(0, 50) + "..." : str;
}

const AgentCard = ({ name, description, agentDocId, onDelete } : { name: string, description: string, agentDocId: string, onDelete: (agentId: string) => void }) => {
    const navigate = useNavigate();
    return (
        <Card className="hover:cursor-pointer" onClick={() => navigate(`/agent/${agentDocId}`)}>
            <CardHeader className="pt-6 pb-3">
                <CardTitle className="flex justify-between">
                    <h2 className="font-black text-md">{name}</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-[18px]"><MoreOutlined/></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(event) => {
                                event.stopPropagation();
                                onDelete(agentDocId);
                            }}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-4">
                <p className="text-sm text-gray-500">{truncateString(description)} </p>
            </CardContent>
            <CardFooter className="flex gap-4 pb-4 w-full justify-between">
                <div className="flex gap-4">
                    <ButtonCN 
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/agent/${agentDocId}/test`);
                        }}
                        variant={'secondary'} 
                        size={'sm'} 
                        className=" border-gray-400 px-4 sm:px-7 h-7"
                    > Test</ButtonCN>

                    <ButtonCN 
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/edit/${agentDocId}`);
                        }}
                        variant={'secondary'}
                        size={'sm'} 
                        className="border-gray-400 px-4 sm:px-7 h-7"
                    >Edit</ButtonCN>

                </div>
                {/* <ButtonCN variant={'default'} size={'sm'} className="h-8 px-4">Connect</ButtonCN> */}
                <ConnectToAgentDialogBox />
            </CardFooter>
        </Card>
    )
}

const NoAgentYetCard = () => {
    return (
        <Card className="w-full col-span-2 shadow-none">
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
                <Bot className="w-16 h-16 text-gray-400" />
                <h2 className="text-2xl font-semibold text-gray-800">No agents yet</h2>
                <p className="text-gray-500 pb-2">Create your first agent to get started</p>
                
                <Link to="/create">
                    <ButtonCN className="px-5">
                        Create Agent
                    </ButtonCN>
                </Link>
            </CardContent>
        </Card>
    )
}