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


const AgentCreate = () => {

  const [ agentName, setAgentName ] = useState('Your AI Agent');
  const [ agentDescription, setAgentDescription ] = useState('');


  return (
    <div className='flex flex-col font-mono min-h-screen bg-gray-100 px-2.5 sm:px-6 md:px-10 lg:px-0'>
          <div className="bg-white flex justify-between items-center px-48 w-full py-5 border">
            <div className="flex flex-col gap-2 w-full pr-20">
              <ButtonCN variant={'outline'} className="h-7 max-w-20 mb-2.5">Back</ButtonCN>
              <Input 
                value={agentName} 
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full h-8 bg-white font-bold text-xl border-none" 
                placeholder="Write description here" 
              />
              <Input 
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                className="w-full text-gray-500 focus-visible:outline-gray-300 h-6 text-sm bg-white border-none" 
                placeholder="Write description here" 
              />
            </div>

            <ButtonCN className="w-[130px]">Deploy</ButtonCN>
          </div>

          <div className="flex flex-grow px-48 gap-4 w-full">
            <div className="flex flex-col w-full h-full py-6 gap-4">
              
              {/* select model */}
              <div className="bg-white border shadow-sm gap-20 rounded-lg flex justify-between items-center py-4 px-6">
                <p className="flex items-center gap-2"> <LuBrainCircuit size={20} /> Model</p>
                <Select>
                  <SelectTrigger className="w-full h-8">
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

              <div className="flex flex-col gap-1 mt-1">
                <h3 className="text-md text-gray-500 font-semibold">Instruction</h3>
                <Textarea 
                  // placeholder="e.g. given the age of the candidate, return whether they are eligible for voting" 
                  className="drop-shadow-none shadow-sm font-sans min-h-[120px]"
                />
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <h3 className="text-md text-gray-500 font-semibold">Output format</h3>
                <div className="flex gap-3">
                  <Textarea 
                    // placeholder="e.g. given the age of the candidate, return whether they are eligible for voting" 
                    className="drop-shadow-none shadow-sm font-sans h-[200px]"
                  />
                  <div className="bg-white rounded-lg border w-full flex-grow"></div>
                </div>
              </div>

            </div>
            
            <div className="w-full flex flex-col py-6 flex-grow bg-white">
              
              {/* input section */}
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

              {/* output section */}
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