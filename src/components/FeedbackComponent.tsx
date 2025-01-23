import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "./ui/popover"
import { Textarea } from "./ui/textarea"
import { ButtonCN } from "./ui/buttoncn";
import { useAuth } from '@clerk/clerk-react';
import { postFeedback } from "../utils/monitor.utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { Rate } from 'antd';



export const FeedbackComponent = () => {
  const { getToken } = useAuth();
  const [ feedback, setFeedback ] = useState('');
  const [ rating, setRating ] = useState(2);

  const onSubmit = async () => {
    const token: string | null = await getToken();

    if (!token) {
      return;
    }
    
    await toast.promise(
      postFeedback(rating, feedback, token),
       {
         loading: 'Sending feedback...',
         success: <b>Thank you for your feedback</b>,
         error: <b>Something went wrong</b>,
       }
     );
  }

    return (
      <Popover>
        <PopoverTrigger>
          <ButtonCN variant="outline" className={`font-semibold border-gray-300 h-8`}>Feedback</ButtonCN>
        </PopoverTrigger>
        
        <PopoverContent>
          <Textarea onChange={(e) => setFeedback(e.target.value)} placeholder='Help us improve :)'/>

          <div className="flex justify-between mt-4 gap-4 items-center">
            <div className="flex-shrink-0">
              <Rate value={rating} onChange={setRating} className="w-auto text-yellow-400" />
            </div>
            <ButtonCN onClick={onSubmit} variant="default" className=" text-white bg-black bg-opacity-80 h-8 flex-grow min-w-0">Send</ButtonCN>
          </div>
          
        </PopoverContent>
      </Popover>
    );
  }
  