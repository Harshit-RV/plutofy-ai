import { Skeleton } from "./ui/skeleton"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export 
const AgentCardSkeleton = () => {
    return (
        <Card className="shadow-none">
            <CardHeader className="pt-6 pb-3">
                <CardTitle className="flex justify-between gap-20">
                    <Skeleton className="w-full h-6 bg-gray-200"></Skeleton>
                    <Skeleton className="w-4 h-6 bg-gray-200"></Skeleton>
                </CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-4">
                <Skeleton className="w-full h-5 bg-gray-200"></Skeleton>
            </CardContent>
            <CardFooter className="flex gap-4 pb-4 w-full justify-between">
                <div className="flex gap-4">
                    <Skeleton className="w-20 h-6 bg-gray-200"></Skeleton>
                    <Skeleton className="w-20 h-6 bg-gray-200"></Skeleton>
                </div>
                <Skeleton className="w-24 h-8 bg-gray-300"></Skeleton>
            </CardFooter>
        </Card>
    )
}