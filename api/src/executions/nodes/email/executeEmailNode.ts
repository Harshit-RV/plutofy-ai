import { OutputStructure } from "../../../models/Agent.model";
import { INode } from "../../../models/Workflow.model";
import parseTemplate from "../../../utils/parseTemplate";
import ExecutionHelper from "../../helper";
import EmailService from "./email.service";

const executeEmailNode = async (node: INode, userId: string, credStructure: OutputStructure[], dataStructure: OutputStructure[], previousNodeData: object) => {
  try {
    if (!node.credentials) {
      throw Error("No credentials set. Credentials are important for Email Node execution")
    }
  
    const creds = await ExecutionHelper.getCredentials(node.credentials, userId, credStructure)
    const data = ExecutionHelper.getDataFromNode(node.data, dataStructure);
  
    const emailService = new EmailService({
      smtpServer: creds.smtpServer as string,
      port: creds.port as number,
      username: creds.username as string,
      password: creds.password as string,
    })

    const parsedHtml = parseTemplate(data.html as string, previousNodeData);
    const parsedSubject = parseTemplate(data.subject as string, previousNodeData);
    const parsedFrom = parseTemplate(data.from as string, previousNodeData);
    const parsedTo = parseTemplate(data.to as string, previousNodeData);

    await emailService.sendEmail({
      from: parsedFrom,
      to: parsedTo,
      subject: parsedSubject,
      html: parsedHtml,
    })
  
  } catch (error) {
    console.log("email node execution error: ", error)
  }
}

export default executeEmailNode;