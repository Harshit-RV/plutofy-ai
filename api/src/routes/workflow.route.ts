import { getAuth, requireAuth } from "@clerk/express";
import { Router } from "express";
import WorkflowService from "../services/workflow.service";

const router = Router()

router.use(requireAuth())

router.get("/", async (req, res) : Promise<any> => {
  try {
    const { userId } = getAuth(req);

    const workflows = await WorkflowService.getWorkflowsByUser(userId!);

    return res.status(200).json(workflows)
  } catch (error) {
    console.error(error)
    return res.status(500).json({error :'Something went wrong'});
  }
})

router.get("/:id", async (req, res) : Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);

    const workflow = await WorkflowService.getWorkflowById(id, userId!);

    return res.status(200).json(workflow)
  } catch (error) {
    console.error(error)
    return res.status(500).json({error :'Something went wrong'});
  }
})

router.post("/", async (req, res) : Promise<any> => {
  try {
    const { userId } = getAuth(req);
    const workflowBody = req.body;
    // TODO: body validation based on NodeType

    const newWorkflow = await WorkflowService.createWorkflow(workflowBody, userId!);

    return res.status(200).json(newWorkflow)
  } catch (error) {
    console.error(error)
    return res.status(500).json({error :'Something went wrong'});
  }
})

router.put("/:id", async (req, res) : Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);
    const workflowBody = req.body;
    // TODO: body validation based on NodeType
    const newWorkflow = await WorkflowService.updateWorkflow(id, userId ?? "", workflowBody);

    return res.status(200).json(newWorkflow)
  } catch (error) {
    console.error(error)
    return res.status(500).json({error :'Something went wrong'});
  }
})

router.delete("/:id", async (req, res) : Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);
    // TODO: body validation based on NodeType
    const newWorkflow = await WorkflowService.deleteWorkflow(id, userId ?? "");

    return res.status(200).json(newWorkflow)
  } catch (error) {
    console.error(error)
    return res.status(500).json({error :'Something went wrong'});
  }
})

export default router;