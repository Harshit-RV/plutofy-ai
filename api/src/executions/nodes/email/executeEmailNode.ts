import { OutputStructure } from "../../../models/Agent.model";
import { INode } from "../../../models/Workflow.model";
import ExecutionHelper from "../../helper";
import EmailService from "./email.service";

const executeEmailNode = async (node: INode, userId: string, credStructure: OutputStructure[], dataStructure: OutputStructure[]) => {
  try {
    if (!node.credentials) {
      throw Error("No credentials set. Credentials are important for Email Node execution")
    }
  
    const creds = await ExecutionHelper.getCredentials(node.credentials, userId, credStructure)
    const data = ExecutionHelper.getDataFromNode(node.data, dataStructure);
  
    const emailService = new EmailService({
      smtpServer: creds.smtpServer,
      port: creds.port,
      username: creds.username,
      password: creds.password,
    })
  
    await emailService.sendEmail({
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: data.html,
    })
  
  } catch (error) {
    console.log(error)
  }
}

export default executeEmailNode;