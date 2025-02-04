import { ButtonCN } from "@/components/ui/buttoncn";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LuBrainCircuit } from "react-icons/lu";
import { Alert } from 'antd';
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
import { TriangleAlert } from "lucide-react";

const llmsList = [
  { modelCategory: "OpenAI", models: ["gpt-3.5", "gpt-4o-2024-08-06", "gpt-babbage"] },
  { modelCategory: "Gemini", models: ["Gemini o"] },
]

const AgentCreate = () => {
  const { getToken } = useAuth();
  
  const [ formData, setFormData ] = useState<Omit<AgentProps, 'userId'>>({
    name: "Untitled Agent",
    description: "",
    modelName: "",
    modelCategory: "",
    instruction: "",
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
    <div className='flex flex-col font-mono min-h-screen bg-gray-100'>
          <div className=" flex justify-between items-center sm:gap-10 bg-white border px-2 sm:px-10 md:px-20 xl:px-48 pt-5 w-full py-5">
            <div className="flex flex-col gap-1 w-full lg:pr-20">
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value})}
                className="w-full bg-white my-2 py-6 px-4 font-bold text-xl rounded-lg focus-visible:ring-gray-400 focus-visible:ring-2 focus-visible:ring-offset-0 border-gray-300" 
                
                // className="w-full bg-gray-100 my-2 font-bold text-xl border-none" 
                placeholder="Name" 
              />
              <Input
                value={formData.description}
                maxLength={200}
                onChange={(e) => setFormData({ ...formData, description: e.target.value})}
                className="w-full bg-white text-gray-500 px-4 text-sm h-8 focus-visible:ring-gray-400 focus-visible:ring-2 focus-visible:ring-offset-0 border-gray-300" 
                // className="w-full bg-gray-100 text-gray-500 focus-visible:outline-gray-300 text-sm h-6 border-none" 
                placeholder="Write description here" 
              />
            </div>

            <ButtonCN onClick={onClick} className="w-[130px] hidden sm:flex">Deploy</ButtonCN>
          </div>

          <div className="flex flex-col lg:flex-row flex-grow px-2 sm:px-10 md:px-20 xl:px-48 lg:gap-10 w-full">
            <div className="flex flex-col w-full lg:w-3/5 h-full py-6 gap-4">
              
              <div className="bg-black bg-opacity-80 text-white border shadow-sm lg:gap-20 rounded-xl flex justify-between items-center py-4 px-5 lg:px-6">
                <p className="flex items-center gap-2"> <LuBrainCircuit size={20} /> Model</p>
                <Select value={formData.modelName} onValueChange={(value) => setFormData({...formData, modelName: value})}>
                  <SelectTrigger className="w-full ml-10 md:ml-48 lg:ml-0 bg-white text-black h-8">
                    <SelectValue placeholder="select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      llmsList.map((llms) => (
                        <SelectGroup>
                          <SelectLabel>{llms.modelCategory} models</SelectLabel>
                          {
                            llms.models.map((model) => (
                              <SelectItem value={model}>{model}</SelectItem>
                            ))
                          }
                        </SelectGroup>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardHeader className="pt-6 pb-3 px-3 md:px-5">
                  <CardTitle className="flex justify-between">
                      <h2 className="font-black text-md">Instruction</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0 pb-4 px-3 md:px-5">
                  <Textarea 
                    value={formData.instruction}
                    onChange={(e) => setFormData({ ...formData, instruction: e.target.value})}
                    placeholder="e.g. given the age of the candidate, return whether they are eligible for voting" 
                    className="bg-gray-100 drop-shadow-none shadow-sm min-h-[120px] focus-visible:outline-gray-300 focus-visible:ring-gray-400 focus-visible:ring-1 outline-gray-300"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pt-6 pb-3 px-3 md:px-5">
                    <CardTitle className="flex justify-between">
                        <h2 className="font-black text-md">Output Format</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-0 pb-4 px-3 md:px-5">
                  <JsonBuilder setOutputStructure={setOutputStructure}/>
                </CardContent>
              </Card>

            </div>
            
            <div className="lg:w-2/5 hidden lg:flex flex-col h-min my-6 py-3 pb-8 rounded-lg bg-gray-200 border">
              <Alert 
                message="This testing component is a work in progress" 
                className="font-bold mx-5 my-2 font-mono text-xs text-gray-500 rounded-md" 
                banner 
              />

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
            <div className="sm:hidden flex gap-5 mb-10 justify-end">
              <ButtonCN onClick={onClick} variant={'outline'} className="w-full max-w-[150px]">Deploy</ButtonCN>
              <ButtonCN onClick={onClick} className="w-full max-w-[150px]">Deploy</ButtonCN>
            </div>
          </div>
    </div>
  );
}

export default AgentCreate;