
// import { Button } from "./components/ui/button";
import { Button } from 'antd';
import { Input } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { AlertCondition } from '../types/monitor';
import { createMonitor } from '../utils/monitor.utils';
import toast from 'react-hot-toast';
import { ButtonCN } from '../components/ui/buttoncn';


function MonitorCreate() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [ monitorUrl, setMonitorUrl ] = useState('');
  const [ alertCondition, setAlertCondition ] = useState<AlertCondition>();
  const [ email, setEmail ] = useState('');

  const onClick = async () => {
    const token: string | null = await getToken();


    if (!monitorUrl || monitorUrl == '' || !alertCondition || !email || email == '' || !token) {
      toast.error('Invalid input');
      return;
    }

    await toast.promise(
      createMonitor({ monitorUrl, alertCondition, email, token }),
       {
         loading: 'Saving...',
         success: <b>Monitor Created</b>,
         error: <b>Could not create monitor.</b>,
       }
     );

     navigate('/');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [ emailCount, setEmailCount ] = useState(1);
  const emailCount = 1;

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='px-3 p-4 sm:p-5 sm:px-14 mt-3 flex flex-col w-full items-center'>

        <div className='flex flex-col sm:flex-row gap-4 sm:justify-between w-full'>
          <ButtonCN onClick={() => navigate('/')} variant={'link'}  className="w-14 bg-white hover:bg-white/50 max-h-8 rounded-md shadow-sm"><ArrowLeftOutlined /></ButtonCN>
          <h1 className='font-black text-[28px] h-[36px] sm:mr-20 font-poppins sm:mt-1.5'>Create Monitor</h1>
          <div className='sm:flex hidden'></div>
        </div>
        

        <div className="w-full sm:w-[550px] mt-2 sm:mt-4">

          <div className='flex flex-col mt-4 border py-7 rounded-lg px-6 sm:px-10 shadow-sm bg-black bg-opacity-80 gap-1'>
            <span className="text-white font-semibold text-lg">URL to monitor</span>
            <Input className='my-2 p-2' onChange={(e) => setMonitorUrl(e.target.value)} />
          </div>


          <div className='flex flex-col mt-5 border py-7 rounded-lg px-6 sm:px-10 shadow-sm bg-black bg-opacity-5 gap-3'>
            <span className=" font-semibold text-lg">Alert Condition</span>
            
            <Select
              style={{ flex: 1 }}
              size='large'
              placeholder='Select'
              onChange={(value: AlertCondition) => setAlertCondition(value)}
              options={[
                { value: 'ISUNAVAILABLE', label: 'When URL is unavailable' },
                { value: 'IS404', label: 'When status code is 404' },
                { value: 'IS500', label: 'When status code is 500' },
                { value: 'IS501', label: 'When status code is 501' },
                { value: 'ISNOT200', label: 'When status code is not 200' },
              ]}
            />

          </div>
          
          <div className='flex flex-col mt-5 border py-7 px-6 sm:px-10 rounded-lg shadow-sm bg-black bg-opacity-5 gap-3'>
            <span className=" font-semibold text-lg">Contact Options</span>

            {
              Array(emailCount).fill(0).map((_, i) => (
                <Input onChange={(e) => setEmail(e.target.value)} key={i} className='p-2' placeholder={`Priority ${i+1}: E-mail`}/>
              ))
            }

            {/* <div className='flex gap-3 mb-3'>
              <Button disabled={emailCount == 5} onClick={() => setEmailCount((value) => value+1)} type='primary' className='w-20 '><PlusOutlined /></Button>
              <Button disabled={emailCount == 1} onClick={() => setEmailCount((value) => value-1)} type='default' className='w-20 '><MinusOutlined /></Button>
            </div> */}


            { emailCount != 1 && <div className='flex justify-between gap-2 mt-1 items-center'>
              
              <span className='text-[15px]'>Time before alerting next priority email</span>
              <Select 
                style={{ width: 100 }}
                placeholder='x mins'
                size='small'
                options={[
                  { value: 10, label: '10 mins' },
                  { value: 5, label: '5 mins' },
                  { value: 2, label: '2 mins' },
                ]}
              />
             
            </div>}

            <div className='h-[2px] bg-gray-300 w-full'></div>
              
            <div className='flex justify-between gap-2 items-center'>
              
              <span className='text-[15px]'>Time before consecutive checks</span>
              <Select 
                style={{ width: 100 }}
                size='small'
                defaultValue={'3'}
                options={[
                  { value: '3', label: '3 mins' },
                ]}
              />
             
            </div>

                
          </div>

          <div className='flex justify-end my-7 gap-8'>
            <Button size='large' className='px-10'>Cancel</Button>
            <Button onClick={onClick} type='primary' size='large' className='px-10'>Create</Button>
          </div>
        </div>

        


      </div>

     
    </div>
  );
}

export const InputField = ({placeholder, type} : {placeholder: string, type:'text' | 'number'}) => {
  return (
    <div>
      <input placeholder={placeholder} required type={type} id="first_name" className="w-80 my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"/>
    </div>
  )
}

export default MonitorCreate
