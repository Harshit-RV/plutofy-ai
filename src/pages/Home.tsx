import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
  
import { Button } from "antd"
import { Link } from "react-router-dom"
import { MoreOutlined } from '@ant-design/icons';
// import { useAuth } from "@clerk/clerk-react";
import { useQuery } from 'react-query'
// import { deleteMonitor, getList } from "../utils/monitor.utils";
// import { AlertCondition } from "../types/monitor";
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
import { deleteAgent, getAllAgents } from "@/utils/agent.utils";

export const Home = () => {
    // const { getToken } = useAuth();

    const fetchList = async () => {
        // const token = await getToken();
        const token = 'token'
        if (!token) return;
        return await getAllAgents(token);
    }

    const onDelete = async ( agentId: string) => {
        // const token = await getToken();
        const token = ''
        // if (!token) return;

        await toast.promise(
            deleteAgent({ agentId: agentId, token: token }),
             {
               loading: 'Deleting...',
               success: <b>Monitor Deleted</b>,
               error: <b>Could not delete monitor.</b>,
             }
           );

        refetchAgents();
    }

    const { data: agents, isLoading: agentsLoading, refetch: refetchAgents } = useQuery('agents', fetchList);

    return (
        <div className='flex justify-center font-mono min-h-screen bg-gray-100 px-2.5 sm:px-6 md:px-10 lg:px-0'>
           
            <div className="py-8 sm:py-9 w-full lg:w-[1100px]">
                {/* {JSON.stringify(agents)} */}

                <div className="flex justify-between h-8 ">
                    <h1 className='font-black text-[21px] sm:text-2xl font-poppins mt-0.5 sm:mt-1.5'>Your Agents</h1>
                    <div className="flex gap-5">
                        <Link to='/create'>
                            <Button type="primary" size="large" className="px-6 sm:px-8 h-9">Create</Button>
                            {/* <ButtonCN variant={'outline'} size={'lg'} className="text-md h-9">Create</ButtonCN> */}
                        </Link>
                    </div>
                </div>
                

                <div className="mt-3 sm:mt-7 grid sm:grid-cols-2 gap-5">
                {
                    !agentsLoading || agents != undefined
                    ?
                    agents?.map((agent) => (
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
                        {/* <MonitorSkeleton/>
                        <MonitorSkeleton/>
                        <MonitorSkeleton/> */}
                    </>
                }
                </div>
            </div>
        </div>
    )
}

const AgentCard = ({ name, description, agentDocId, onDelete } : { name: string, description: string, agentDocId: string, onDelete: (agentId: string) => void }) => {
    return (
        <Card>
            <CardHeader className="pt-6 pb-3">
                <CardTitle className="flex justify-between">
                    <h2 className="font-black text-md">{name}</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-[18px]"><MoreOutlined/></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete(agentDocId)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-4">
                <p className="text-sm text-gray-500">{description} </p>
            </CardContent>
            <CardFooter className="flex gap-4 pb-4 w-full justify-between">
                <div className="flex gap-4">
                    <ButtonCN variant={'secondary'} size={'sm'} className=" border-gray-400 px-7 h-7">Test</ButtonCN>
                    <ButtonCN variant={'secondary'} size={'sm'} className=" border-gray-400 px-7 h-7">Edit</ButtonCN>
                </div>
                <ButtonCN variant={'default'} size={'sm'} className="h-8 px-4">Connect</ButtonCN>
            </CardFooter>
        </Card>
    )
}