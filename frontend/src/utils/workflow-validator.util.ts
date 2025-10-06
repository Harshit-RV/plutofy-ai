import { PrimitiveType } from "@/types/common-types";
import { INode } from "@/types/workflow";
import workflowScheme from "@/workflow-scheme";

class WorkflowValidator {
  
  static isNodeConfigCorrect = (node: INode) : boolean => {
    const scheme = workflowScheme.nodes.find(s => s.type === node?.type);
    if (!scheme) return false;

    const credentialsOk = scheme.credentials.length === 0 || !!node.credentials;
    const nodeData = (node.data as Record<string, PrimitiveType>) || {};
    
    const dataOk = scheme.data.length === 0 || scheme.data.every((f) => {
      const v = nodeData[f.name];
      return this.isFieldFilled(v);
    });

    if (credentialsOk && dataOk) return true;

    return false;
  }

  static isWorkflowConfigCorrect = (nodes: INode[]) : boolean => {
    for (const node of nodes) {
      if (this.isNodeConfigCorrect(node)) continue;
      return false;
    }
    return true;
  }

  private static isFieldFilled = (value: PrimitiveType): boolean => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  };

}

export default WorkflowValidator;