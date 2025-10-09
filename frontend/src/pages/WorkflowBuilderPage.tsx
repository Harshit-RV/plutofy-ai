import WorkflowService from '@/services/workflow.service';
import { useAuth } from '@clerk/clerk-react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react";
import { IConnection, INode } from '@/types/workflow';
import WorkflowBuilder from '@/components/workflows/WorkflowBuilder';


export default function WorkflowBuilderPage() {
  const { workflowDocId } = useParams(); 
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const fetchWorkflow = async () => {
    const token = await getToken();
    if (!token) return;
    if (!workflowDocId) return;
    return await WorkflowService.getWorkflowById(workflowDocId, token);
  };

  const syncWorkflowWithDB = useCallback(
    async (nodes: INode[], edges: IConnection[], name: string) => {
      const token = await getToken();
      if (!token) return;
      if (!workflowDocId) return;
  
      queryClient.setQueryData([`workflow-${workflowDocId}`], (oldData: unknown) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          name,
          nodes,
          connections: edges,
        };
      });
  
      await WorkflowService.updateWorkflow(workflowDocId, {
        name,
        nodes,
        connections: edges,
      }, token);
    },
    [getToken, queryClient, workflowDocId]
  );

  const {
    data: workflow,
    isLoading: workflowLoading,
  } = useQuery(`workflow-${workflowDocId}`, fetchWorkflow);

  if (workflowLoading) {
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
    <ReactFlowProvider>
      <div className='h-[calc(100vh-3.5rem)] w-full p-4 bg-gray-100 dark:bg-background'>
        <WorkflowBuilder 
          workflowDocId={workflowDocId ?? ""}
          syncWorkflowWithDB={syncWorkflowWithDB} 
          workflowName={workflow?.name ?? ""}
          initialEdges={workflow?.connections ?? []} 
          initialNodes={workflow?.nodes ?? []}
        />
      </div>
    </ReactFlowProvider>
  )
}