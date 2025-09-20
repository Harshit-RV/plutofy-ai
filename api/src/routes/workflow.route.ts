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
  }
})

router.post("/", async (req, res) : Promise<any> => {
  try {
    const { userId } = getAuth(req);
    const workflowBody = req.body;
    console.log("control reached here")
    console.log(workflowBody)

    // TODO: body validation based on NodeType

    const newWorkflow = await WorkflowService.createWorkflow(workflowBody, userId!);

    return res.status(200).json(newWorkflow)
  } catch (error) {
    console.error(error)
  }
})

router.put("/:id", async (req, res) : Promise<any> => {

})

export default router;