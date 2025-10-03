import workflowScheme from "@/workflow-scheme";
import { useEffect, useState, useCallback } from "react";
import { ButtonCN } from "@/components/ui/buttoncn";
import { INode, NodeType } from "@/types/workflow";
import AgentNodeExpanded from "../../components/AgentNodeExpanded";
import { NodeExpandedProps } from "../NodeExpanded";
import NodeDataEditor from "../../components/NodeDataEditor";
import NodeCredentialsEditor from "../../components/NodeCredentialsEditor";
import JsonBuilderWrappedForWorkflow from "../../components/JsonBuilderWrappedForWorkflow";
import { OutputStructure } from "@/types/agent";
import DataFromPreviousNodeCard from "../../components/DataFromPreviousNodeCard";

const GeneralNodeExpanded = ({ node, nodes, edges, setNodes, setEdges } : NodeExpandedProps) => {
  const nodeInfoFromScheme = workflowScheme.nodes.find(wf => wf.type == node.type);
  
  const [ localData, setLocalData ] = useState<INode>(() => node || {});
  const [ previousNodeData, setPrevioudNodeData ] = useState<INode | null>(null)
  const [ hasUnsavedChanges, setHasUnsavedChanges ] = useState(false);

  // saves both new data and credentials
  const saveNodeChanges = () => {
    setNodes((nodes) =>
      nodes.map((singleNode) => {
        if (singleNode.id === node.id) {
          return {
            ...singleNode,
            credentials: localData.credentials,
            data: localData.data
          };
        }
        return singleNode;
      }),
    );
    setHasUnsavedChanges(false);
  };

  const getPreviousNodeData = useCallback(() => {
    const previousNodes = edges.filter(item => {
      return (item.target === node.id && item.type != "child")
    }).map(item => item.source);

    if (previousNodes.length == 0) return

    const nodeData = nodes.find(item => item.id === previousNodes[0]);

    if (nodeData) {
      setPrevioudNodeData(nodeData)
    }
  }, [edges, node.id, nodes])

  useEffect(() => {
    getPreviousNodeData()
  }, [getPreviousNodeData])

  return (
    <div className='flex flex-col w-full py-5 px-4'>
      
      <div className='flex items-center gap-3'>
        <img src={nodeInfoFromScheme?.image} className='size-10' alt="" />
        <h1 className='font-bold text-lg'>{nodeInfoFromScheme?.name}</h1>
      </div>

      <p className='text-sm my-3'>{nodeInfoFromScheme?.description}</p>

      { previousNodeData && (
        <DataFromPreviousNodeCard 
          previousNodeData={previousNodeData} 
          localData={localData} 
          setLocalData={setLocalData} 
          setHasUnsavedChanges={setHasUnsavedChanges} 
        /> 
      )}
 
      { (nodeInfoFromScheme && nodeInfoFromScheme.credentials.length != 0) && (
        <NodeCredentialsEditor 
          className="mt-3"
          node={node}
          localData={localData}
          setLocalData={setLocalData}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
      )}

      {
        (nodeInfoFromScheme && nodeInfoFromScheme.data.length != 0) && (
          <NodeDataEditor 
            className="mt-3"
            nodeInfoFromScheme={nodeInfoFromScheme}
            node={node}
            setNodes={setNodes}
            localData={localData}
            setLocalData={setLocalData}
            hasUnsavedChanges={hasUnsavedChanges}
            setHasUnsavedChanges={setHasUnsavedChanges}
            outputStructure={((previousNodeData?.data || {}).outputStructure || []) as OutputStructure[]}
          />
        )
      }

      { (node.type === NodeType.agentNode && (localData.data.getStructuredResponse as boolean)) && (
        <JsonBuilderWrappedForWorkflow 
          className="mt-3"
          localData={localData}
          setHasUnsavedChanges={setHasUnsavedChanges}
          setLocalData={setLocalData}
        />
      ) }

      { !(nodeInfoFromScheme?.credentials.length == 0 && nodeInfoFromScheme?.data.length == 0) && (
        <div className='mt-3 pt-4 border-t'>
          <ButtonCN 
            onClick={saveNodeChanges}
            disabled={!hasUnsavedChanges}
            className='w-full'
          >
            {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
          </ButtonCN>
        </div>
      )}

      { node.type === NodeType.agentNode && <AgentNodeExpanded node={node} nodes={nodes} edges={edges} nodeInfo={nodeInfoFromScheme!} setNodes={setNodes} setEdges={setEdges} /> }
    </div>
  )
}

export default GeneralNodeExpanded;