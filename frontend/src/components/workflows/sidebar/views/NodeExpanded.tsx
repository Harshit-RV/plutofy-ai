import workflowScheme from "@/workflow-scheme";
import { Dispatch, SetStateAction } from "react";
import { Node } from '@xyflow/react';
import SingleInputField from "./SingleInputField";

const NodeExpanded = ({ node, setNodes } : { node: Node, setNodes: Dispatch<SetStateAction<Node[]>> }) => {
  const nodeInfoFromScheme = workflowScheme.nodes.find(wf => wf.type == node.type);

  return (
    <div className='flex flex-col w-full py-5 px-4'>
      
      <div className='flex items-center gap-3'>
        <img src={nodeInfoFromScheme?.image} className='size-10' alt="" />
        <h1 className='font-bold text-lg'>{nodeInfoFromScheme?.name}</h1>
      </div>

      <p className='text-sm mt-3'>{nodeInfoFromScheme?.description}</p>
      
      <div className='mt-5'>
        {
          nodeInfoFromScheme?.data.map((inputField, index) => (
            <div key={index} className='mt-4'>
              <p className='text-sm'>{inputField.displayName}</p>
              <SingleInputField 
                type={inputField.type} 
                value={(node.data || {})[inputField.name] as string} 
                
                onValueChange={(val) => {
                  setNodes((nodes) =>
                    nodes.map((singleNode) => {
                      if (singleNode.id === node.id) {
                        return {
                          ...singleNode,
                          data: {
                            ...(singleNode.data || {}),
                            [inputField.name]: val
                          }
                        };
                      }
                      
                      return singleNode;
                    }),
                  );
                }}

                name={inputField.name} 
                displayName={inputField.displayName} 
              />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default NodeExpanded;
