import { ButtonCN } from "@/components/ui/buttoncn";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { AgentDoc, AgentProps, OutputStructure } from "@/types/agent";
import toast from "react-hot-toast";
import { createAgent } from "@/utils/agent.utils";
import AIDeploymentSuccess from "./Success";

const AgentCreate = () => {
  const [ formData, setFormData ] = useState<AgentProps>({
    name: "Your AI Agent",
    userId: "harshit-rai-verma", //TODO: get user id from auth
    description: "this is the description",
    modelName: "",
    modelCategory: "",
    instruction: "this is the basic instruction",
    // description: "",
    // modelName: "",
    // modelCategory: "",
    // instruction: "",
    outputStructure: [],
  })

  const [ createdAgent, setCreatedAgent ] = useState<AgentDoc | null>(null);

  const onClick = async () => {
    console.log(formData)
    // const token: string | null = await getToken();

    if (!formData.name || formData.name == '' || !formData.modelName || formData.modelName == '' || !formData.instruction || formData.instruction == '') {
      toast.error('Please fill all details');
      return;
    }

    const agent = await toast.promise(
      createAgent({ agentProps: formData, token: '' }),
       {
         loading: 'Creating...',
         success: <b>Agent Created</b>,
         error: <b>Could not create agent.</b>,
       }
    );

    setCreatedAgent(agent);
  }

  return (
    createdAgent ? (
      <AIDeploymentSuccess name={createdAgent.name} agentId={createdAgent.agentId} />
    ) : 
    <div className='flex flex-col font-mono min-h-screen bg-gray-100 px-2.5 sm:px-6 md:px-10 lg:px-0'>
          <div className=" flex justify-between items-center bg-white border px-48 pt-5 w-full py-5">
            <div className="flex flex-col w-full pr-20">
              {/* <Input 
                value={formData.name} 
                disabled
                onChange={(e) => setFormData({ ...formData, name: e.target.value})}
                className="w-full bg-white my-2 font-bold text-xl border-none" 
                placeholder="Name" 
              /> */}
              <h2 className="w-full bg-white mx-3 my-2 font-bold text-xl border-none">
                {formData.name} 
              </h2>
              <p className="w-full bg-white mx-3 mt-2  text-gray-500 focus-visible:outline-gray-300 text-sm h-6 border-none">
                {formData.description} 
              </p>
            </div>

            <ButtonCN onClick={onClick} variant={'outline'} className="w-[130px]">Edit</ButtonCN>
          </div>

          <div className="flex flex-grow px-48 pt-10 w-full">
            
            <div className="w-full flex h-min gap-5 px-2">
            {/* <div className="w-full flex  h-min my-6 py-3 pb-8 rounded-lg bg-gray-200 border"> */}
              
              <div className="flex flex-col w-full gap-1">
                <h3 className="text-md text-gray-500 font-semibold">Input</h3>
                <Textarea 
                  className="drop-shadow-none shadow-sm font-sans min-h-[230px]"
                />
                <div className="flex justify-end gap-3 mt-2">
                  <ButtonCN variant={'outline'} size={'sm'} className="">Clear</ButtonCN>
                  <ButtonCN className="" size={'sm'}>Get Response</ButtonCN>
                </div>
              </div>


              <div className="flex flex-col w-full gap-1">
                <h3 className="text-md text-gray-500 font-semibold">Output</h3>
                <Textarea 
                  className="drop-shadow-none shadow-sm font-sans min-h-[230px]"
                />
              </div>

            </div>
          </div>
    </div>
  );
}

export default AgentCreate;