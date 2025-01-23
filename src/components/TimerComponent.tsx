import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { getTimer } from "../utils/timer.utils";
import { useQuery } from "react-query";
import { Skeleton } from "./ui/skeleton";

export const TimerComponent = ( { refetchMonitors, className } : { refetchMonitors: () => void, className: string }) => {
  const { getToken } = useAuth();
  const [timer, setTimer] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(180);
  
  const fetchTimer = async () => {
    const token = await getToken();
    if (!token) return null;
    return await getTimer(token);
  };
  
  const { data, error, isLoading, refetch } = useQuery('timer', fetchTimer);
  
  useEffect(() => {
    if (data) {
      setTimer(new Date(data.lastCheck));
      const initialDiffInSeconds = Math.floor((Date.now() - new Date(data.lastCheck).getTime()) / 1000);
      setRemainingTime(Math.max(180 - initialDiffInSeconds, 0));
    }
  }, [data]);
  
  useEffect(() => {
    if (timer && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, remainingTime]);

  useEffect(() => {
    if (remainingTime == 0) {
        refetch();
        refetchMonitors();
        setRemainingTime(180);
    }
    
  }, [refetch, remainingTime, refetchMonitors]);



  if (isLoading) return <Skeleton className={`w-40 max-h-6 sm:h-6 mt-2 bg-gray-300 ${className}`} />;
  if (error) return <Skeleton className={`w-40 max-h-6 sm:h-6 mt-2 bg-gray-300 ${className}`} />;

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`font-semibold text-lg text-gray-400 ${className}`}>
      <div> <span className="text-gray-400 text-sm">Next ping in</span> {formatTime(remainingTime)} mins</div>
    </div>
  );
};