import WorkflowEntity, { WorkflowProps } from "../models/Workflow.model";

class WorkflowService {
  static async createWorkflow(data: WorkflowProps, userId: string) {
    const workflow =  new WorkflowEntity({
      ...data, userId
    })
    return workflow.save();
  } 

  static async updateWorkflow(id: string) {} 

  static async deleteWorkflow(id: string) {} 

  static async getWorkflowsByUser(userId: string) {
    return WorkflowEntity.find({ userId });
  }

  static async getWorkflowById(id: string, userId: string) {
    return WorkflowEntity.find({ _id: id, userId: userId});
  }
}

export default WorkflowService;