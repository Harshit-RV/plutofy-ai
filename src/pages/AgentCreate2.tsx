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

const AgentCreate = () => {

  const [ agentName, setAgentName ] = useState('Your AI Agent');
  const [ agentDescription, setAgentDescription ] = useState('');


  return (
    <div className='flex flex-col font-mono min-h-screen bg-gray-100 px-2.5 sm:px-6 md:px-10 lg:px-0'>
          <div className=" flex justify-between items-center px-48 pt-7 w-full py-5">
            <div className="flex flex-col w-full pr-20">
              <Input 
                value={agentName} 
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full bg-gray-100 my-2 font-bold text-xl border-none" 
                placeholder="Title" 
              />
              <Input 
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                className="w-full bg-gray-100 text-gray-500 focus-visible:outline-gray-300 text-sm h-8 border-none" 
                placeholder="Write description here" 
              />
            </div>

            <ButtonCN className="w-[130px]">Deploy</ButtonCN>
          </div>

          <div className="flex flex-grow px-48 gap-10 w-full">
            <div className="flex flex-col w-3/5 h-full py-6 gap-4">
              
              <div className="bg-black bg-opacity-70 text-white border shadow-sm gap-20 rounded-lg flex justify-between items-center py-4 px-6">
                <p className="flex items-center gap-2"> <LuBrainCircuit size={20} /> Model</p>
                <Select>
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

              {/* <div className="flex flex-col gap-1 mt-1 bg-[#56667a] rounded-lg p-4"> */}
              <div className="flex flex-col gap-2 mt-1 bg-black rounded-lg bg-opacity-10 p-4">
                <h3 className="text-md text-gray-600 font-semibold">Instruction</h3>
                <Textarea 
                  placeholder="e.g. given the age of the candidate, return whether they are eligible for voting" 
                  className="drop-shadow-none shadow-sm min-h-[120px] focus-visible:outline-gray-300 focus-visible:ring-gray-400 focus-visible:ring-1 outline-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1 mt-1 bg-black rounded-lg bg-opacity-10 p-4">
                <h3 className="text-md text-gray-600 font-semibold">Output format</h3>
                <div className="flex gap-3">
                  <JsonBuilder />
                </div>
              </div>

            </div>
            
            <div className="w-2/5 flex flex-col h-min my-6 py-3 pb-8 rounded-md bg-gray-200">
              
              <div className="flex flex-col gap-1 mt-1 px-6">
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

              <div className="flex flex-col gap-1 px-6">
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