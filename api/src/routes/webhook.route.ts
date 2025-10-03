import e, { Router } from "express";
import executeWorkflow from "../executions/execute-workflow";
import { getAuth, requireAuth } from "@clerk/express";
import WebhookService from "../services/webhook.service";
import WorkflowService from "../services/workflow.service";

const router = Router()


// TODO: ideate whether this should accept Workflow ID or Webhook ID
// TODO: add support for other methods. Users should be able to execute workflow using both POST and GET requests
router.get("/:id", async (req, res) : Promise<any> => {
  try {
    const { id } = req.params;

    const webhookRecord = await WebhookService.getWebhookById(id);
    
    if (!webhookRecord) return res.status(400).json({error: "Workflow not found"})

    const workflowToExecute = await WorkflowService.getWorkflowById(webhookRecord.workflowId, webhookRecord.userId);

    if (!workflowToExecute) return res.status(400).json({error: "Workflow not found"})

    await executeWorkflow({
      workflow: workflowToExecute,
      nodeId: webhookRecord.nodeId,
      userId: webhookRecord.userId
    }, [ { nodeId: webhookRecord.nodeId, data: {} } ])

    return res.status(200).json({final: "Execution trigger"})
  } catch (error) {
    console.error(error)
    return res.status(500).json({final: "failure"})
  }
})

router.use(requireAuth());

router.post("/", async (req, res) : Promise<any> => {
  try {
    const { userId } = getAuth(req);
    const webhookBody = req.body;
    // TODO: body validation based on NodeType

    const newWebhook = await WebhookService.createWebhook(webhookBody, userId!);

    return res.status(200).json(newWebhook)
  } catch (error) {
    console.error(error)
    return res.status(500).json({error :'Something went wrong'});
  }
})

// deletes by workflow ID, not Webhook ID
router.delete("/:id", async (req, res) : Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);

    const deletedWebhook = await WebhookService.deleteWebhookByWorkflowId(id, userId ?? "");
    res.status(200).json(deletedWebhook)
  } catch (error) {
    res.status(500).json({error: "Something went wrong"})
  }
})

export default router;