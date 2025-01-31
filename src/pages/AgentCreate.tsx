import { ButtonCN } from "@/components/ui/buttoncn";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LuBrainCircuit } from "react-icons/lu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import JsonBuilder from "@/components/JsonInput";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AgentDoc, AgentProps, OutputStructure } from "@/types/agent";
import toast from "react-hot-toast";
import { createAgent } from "@/utils/agent.utils";
import AIDeploymentSuccess from "./Success";
import { useAuth } from "@clerk/clerk-react";

const AgentCreate = () => {
  const { getToken } = useAuth();
  
  const [ formData, setFormData ] = useState<Omit<AgentProps, 'userId'>>({
    name: "Your AI Agent",
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

  const setOutputStructure = (outputStructure : OutputStructure[]) => {
    setFormData({...formData, outputStructure: outputStructure})
  }

  const [ createdAgent, setCreatedAgent ] = useState<AgentDoc | null>(null);

  const onClick = async () => {
    console.log(formData)
    const token: string | null = await getToken();
    if (!token) return;

    if (!formData.name || formData.name == '' || !formData.modelName || formData.modelName == '' || !formData.instruction || formData.instruction == '') {
      toast.error('Please fill all details');
      return;
    }

    const agent = await toast.promise(
      createAgent({ agentProps: formData, token: token }),
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
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value})}
                className="w-full bg-white my-2 font-bold text-xl border-none" 
                placeholder="Name" 
              />
              <Input 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value})}
                className="w-full bg-white text-gray-500 focus-visible:outline-gray-300 text-sm h-6 border-none" 
                placeholder="Write description here" 
              />
            </div>

            <ButtonCN onClick={onClick} className="w-[130px]">Deploy</ButtonCN>
          </div>

          <div className="flex flex-grow px-48 gap-10 w-full">
            <div className="flex flex-col w-3/5 h-full py-6 gap-4">
              
              <div className="bg-black bg-opacity-80 text-white border shadow-sm gap-20 rounded-xl flex justify-between items-center py-4 px-6">
                <p className="flex items-center gap-2"> <LuBrainCircuit size={20} /> Model</p>
                <Select value={formData.modelName} onValueChange={(value) => setFormData({...formData, modelName: value})}>
                  <SelectTrigger className="w-full bg-white text-black h-8">
                    <SelectValue placeholder="select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>OpenAI Models</SelectLabel>
                      <SelectItem value="gpt-3.5">gpt-3.5</SelectItem>
                      <SelectItem value="gpt-4o-2024-08-06">gpt-4o-2024-08-06</SelectItem>
                      <SelectItem value="gpt-babbage">gpt-babbage</SelectItem>
                    </SelectGroup>

                    <SelectGroup>
                      <SelectLabel>Gemini Models</SelectLabel>
                      <SelectItem value="Gemini o">Gemini o</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardHeader className="pt-6 pb-3">
                  <CardTitle className="flex justify-between">
                      <h2 className="font-black text-md">Instruction</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0 pb-4">
                  <Textarea 
                    value={formData.instruction}
                    onChange={(e) => setFormData({ ...formData, instruction: e.target.value})}
                    placeholder="e.g. given the age of the candidate, return whether they are eligible for voting" 
                    className="bg-gray-100 drop-shadow-none shadow-sm min-h-[120px] focus-visible:outline-gray-300 focus-visible:ring-gray-400 focus-visible:ring-1 outline-gray-300"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pt-6 pb-3">
                    <CardTitle className="flex justify-between">
                        <h2 className="font-black text-md">Output Format</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-0 pb-4">
                  <JsonBuilder setOutputStructure={setOutputStructure}/>
                </CardContent>
              </Card>

            </div>
            
            <div className="w-2/5 flex flex-col h-min my-6 py-3 pb-8 rounded-lg bg-gray-200 border">
              
              <div className="flex flex-col gap-1 mt-1 px-5">
                <h3 className="text-md text-gray-500 font-semibold">Input</h3>
                <Textarea 
                  className="drop-shadow-none shadow-sm font-sans min-h-[180px]"
                />
                <div className="flex justify-end gap-3 mt-2">
                  <ButtonCN variant={'outline'} size={'sm'} className="">Clear</ButtonCN>
                  <ButtonCN className="" size={'sm'}>Get Response</ButtonCN>
                </div>
              </div>

              <div className="h-1 w-full my-4 bg-gray-100"></div>

              <div className="flex flex-col gap-1 px-5">
                <h3 className="text-md text-gray-500 font-semibold">Output</h3>
                <Textarea 
                  className="drop-shadow-none shadow-sm font-sans min-h-[180px]"
                />
              </div>
            </div>
          </div>
    </div>
  );
}

export default AgentCreate;