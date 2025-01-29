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
// import { useQuery } from 'react-query'
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
// import toast from "react-hot-toast";
import { ButtonCN } from "@/components/ui/buttoncn";

export const Home = () => {
    // const { getToken } = useAuth();

    // const fetchList = async () => {
    //     const token = await getToken();
    //     if (!token) return;
    //     return await getList(token);
    // }

    // const convertAlertConditionToString = (alertCondition: AlertCondition) => {
    //     switch (alertCondition) {
    //         case 'ISUNAVAILABLE':
    //             return 'When URL is unavailable';
    //         case 'IS404':
    //             return 'When URL returns 404';
    //         case 'ISNOT200':
    //             return 'When URL returns a status code other than 200';
    //         case 'IS500':
    //             return 'When URL returns 500';
    //         case 'IS501':
    //             return 'When URL returns 501';
    //         default:
    //             return '';
    //     }
    // }

    // const onDelete = async ( monitorId: string) => {
    //     const token = await getToken();
    //     if (!token) return;

    //     await toast.promise(
    //         deleteMonitor({ monitorId: monitorId, token: token }),
    //          {
    //            loading: 'Deleting...',
    //            success: <b>Monitor Deleted</b>,
    //            error: <b>Could not delete monitor.</b>,
    //          }
    //        );

    //     refetchMonitors();
    // }

    // const { data: monitors, isLoading: monitorLoading, refetch: refetchMonitors } = useQuery('events', fetchList);

    return (
        <div className='flex justify-center font-mono min-h-screen bg-gray-100 px-2.5 sm:px-6 md:px-10 lg:px-0'>
           
            <div className="py-8 sm:py-9 w-full lg:w-[1100px]">

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
                {/* <div className="mt-3 sm:mt-7 flex flex-col gap-3 drop-shadow-sm "> */}
                    <ExampleAgentCard />
                    <ExampleAgentCard />
                    <ExampleAgentCard />
                </div>
            </div>
        </div>
    )
}

const ExampleAgentCard = () => {
    return (
        <Card>
            <CardHeader className="pt-6 pb-3">
                <CardTitle className="flex justify-between">
                    <h2 className="font-black text-md"> Water drinkability score tester</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-[18px]"><MoreOutlined/></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {}}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-4">
                <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et . </p>
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