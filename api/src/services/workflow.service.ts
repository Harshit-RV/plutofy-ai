import WorkflowEntity, { WorkflowProps } from "../models/Workflow.model";

class WorkflowService {
  static async createWorkflow(data: WorkflowProps, userId: string) {
    const workflow =  new WorkflowEntity({
      ...data, userId
    })
    return workflow.save();
  } 

  static async updateWorkflow(id: string, userId: string, data: WorkflowProps) {
    return await WorkflowEntity.updateOne({ _id: id, userId: userId }, { $set: { nodes: data.nodes, name: data.name, connections: data.connections } })
  } 

  static async deleteWorkflow(id: string, userId: string) {
    return await WorkflowEntity.findOneAndDelete({ _id: id, userId: userId })
  } 

  static async getWorkflowsByUser(userId: string) {
    return WorkflowEntity.find({ userId });
  }

  static async getWorkflowById(id: string, userId: string) {
    const records = await WorkflowEntity.find({ _id: id, userId: userId});
    if (records.length == 0) return null
    return records[0]
  }
}

export default WorkflowService;