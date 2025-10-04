import { ButtonCN } from "@/components/ui/buttoncn";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
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
import JsonBuilder from "@/components/json-forms/JsonInput";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AgentDoc, AgentProps, OutputStructure } from "@/types/agent";
import toast from "react-hot-toast";
import { createAgent, getAgentByDocId, updateAgent } from "@/utils/agent.utils";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AgentDeploymentSuccessCard from "@/components/agents/AgentDeploymentSuccessCard";

const llmsList = [
  { modelCategory: "OpenAI", models: ["gpt-3.5", "gpt-4o-2024-08-06", "gpt-babbage"] },
  { modelCategory: "Gemini", models: ["Gemini o"] },
]

const whiteBgGray200Border = "bg-background border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900";
const noRingClass = "focus-visible:ring-gray-400 dark:focus-visible:ring-gray-800 focus-visible:ring-2 focus-visible:ring-offset-0";

type Mode = 'CREATE' | 'EDIT';

const AgentCreate = ({ mode } : { mode: Mode }) => {
  const { getToken } = useAuth();
  const { agentDocId } = useParams(); 
  
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

  const [ loading, setLoading ] = useState(mode == 'EDIT');

  const [ createdAgent, setCreatedAgent ] = useState<AgentDoc | null>(null);

  const onClick = async () => {
    console.log(formData)
    const token: string | null = await getToken();
    if (!token) return;

    if (!formData.name || formData.name == '' || !formData.description || formData.description == '' || !formData.modelName || formData.modelName == '' || !formData.instruction || formData.instruction == '') {
      toast.error('Please fill all details');
      return;
    }
    if (mode === 'EDIT') {
      if (!agentDocId) return;
      const agent = await toast.promise(
        updateAgent({agentId: agentDocId, updateFields: formData, token: token }),
        {
          loading: 'Editing...',
          success: <b>Agent Edited</b>,
          error: <b>Could not edit agent.</b>,
        }
      );
      setCreatedAgent(agent);
    } else {
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

  }

  const fetchAgentForEditing = async () => {
    const token: string | null = await getToken();
    if (!token) return;
    if (!agentDocId) return;
    const agent = await getAgentByDocId({agentDocId: agentDocId, token: token})
    setFormData({
      name: agent.name,
      description: agent.description,
      modelName: agent.modelName,
      modelCategory: agent.modelCategory,
      instruction: agent.instruction,
      outputStructure: agent.outputStructure,
    })
    setLoading(false);
  }

  useEffect(() => {
    if (mode === 'EDIT') {
      fetchAgentForEditing();
    } else {
      setFormData({
        name: "Untitled Agent",
        description: "",
        modelName: "",
        modelCategory: "",
        instruction: "",
        outputStructure: [],
      })
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <Card className="w-[300px]">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-center text-sm text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    createdAgent ? (
      <AgentDeploymentSuccessCard name={createdAgent.name} agentId={createdAgent.agentId} />
    ) : 
    <div className='flex flex-col font-mono min-h-screen bg-gray-100 dark:bg-background'>
          <div className="flex justify-between items-center sm:gap-10 bg-white dark:bg-background border px-2 sm:px-10 md:px-20 xl:px-48 pt-5 w-full py-5">
            <div className="flex flex-col w-full lg:pr-20">
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value})}
                className={`${whiteBgGray200Border} my-2 py-6 px-4 font-bold text-lg rounded-lg ${noRingClass}`}
                placeholder="Name" 
              />
              <Input
                value={formData.description}
                maxLength={200}
                onChange={(e) => setFormData({ ...formData, description: e.target.value})}
                className={`${whiteBgGray200Border} text-gray-500 px-4 h-8 text-sm ${noRingClass}`}
                placeholder="Write description here" 
              />
            </div>

            <ButtonCN onClick={onClick} className="w-[130px] hidden sm:flex">
              { mode == "CREATE" ? 'Deploy' : 'Update' }
            </ButtonCN>
          </div>

          <div className="flex flex-col lg:flex-row flex-grow px-2 sm:px-10 md:px-20 xl:px-48 lg:gap-6 w-full">
            <div className="lg:w-4/6 flex flex-col w-full h-full py-6 gap-4">
              
              <Card className="w-full border bg-black bg-opacity-80 text-white lg:gap-20 rounded-xl flex justify-between items-center py-3 px-5 lg:px-6">
              {/* <div className="bg-black bg-opacity-80 text-white border lg:gap-20 rounded-xl flex justify-between items-center py-4 px-5 lg:px-6"> */}
                <p className="flex items-center gap-2"> <LuBrainCircuit size={20} /> Model</p>
                <Select value={formData.modelName} onValueChange={(value) => setFormData({...formData, modelName: value})}>
                  <SelectTrigger className="w-full max-w-96 ml-10 md:ml-48 lg:ml-0 bg-background text-foreground h-8">
                    <SelectValue placeholder="select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      llmsList.map((llms, index) => (
                        <SelectGroup key={index}>
                          <SelectLabel>{llms.modelCategory} models</SelectLabel>
                          {
                            llms.models.map((model, index) => (
                              <SelectItem key={index} value={model}>{model}</SelectItem>
                            ))
                          }
                        </SelectGroup>
                      ))
                    }
                  </SelectContent>
                </Select>
              </Card>

              <Card className="">
                <CardHeader className="pt-5 pb-3 px-3 md:px-4">
                  <CardTitle className="flex justify-between">
                    <h4 className="text-sm font-semibold">
                      Instruction
                    </h4>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0 pb-4 px-3 md:px-4">
                  <Textarea 
                    value={formData.instruction}
                    onChange={(e) => setFormData({ ...formData, instruction: e.target.value})}
                    placeholder="e.g. given the age of the candidate, return whether they are eligible for voting" 
                    className="bg-gray-100 bg-background drop-shadow-none shadow-sm min-h-[120px] focus-visible:outline-gray-300 focus-visible:ring-gray-400 focus-visible:ring-1 outline-gray-300"
                  />
                </CardContent>
              </Card>

              <Card className="">
                <CardHeader className="pt-6 pb-1 px-3 md:px-4">
                    <CardTitle>
                      <h4 className="text-sm font-semibold">
                        Output Format
                      </h4>
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-0 pb-4 px-3 md:px-4">
                  <JsonBuilder 
                    outputStructure={formData.outputStructure} 
                    setOutputStructure={setOutputStructure}
                  />
                </CardContent>
              </Card>

            </div>
            
            <div className="lg:w-2/6 hidden lg:flex flex-col h-min my-6 py-3 pb-8 rounded-lg bg-gray-200 dark:bg-background border">
              <Alert 
                message="This component is a work in progress" 
                className="font-bold mx-5 my-2 font-mono text-xs text-gray-500 rounded-md" 
                banner 
              />

              <div className="flex flex-col gap-1 mt-1 px-5">
                <h3 className="text-sm text-gray-500 font-semibold">Input</h3>
                <Textarea 
                  className="drop-shadow-none shadow-sm font-sans min-h-[180px]"
                />
                <div className="flex justify-end gap-3 mt-2">
                  <ButtonCN variant={'outline'} size={'sm'} className="">Clear</ButtonCN>
                  <ButtonCN className="" size={'sm'}>Get Response</ButtonCN>
                </div>
              </div>

              <div className="h-1 w-full my-4 bg-gray-100 dark:bg-gray-800"></div>

              <div className="flex flex-col gap-1 px-5">
                <h3 className="text-sm text-gray-500 font-semibold">Output</h3>
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