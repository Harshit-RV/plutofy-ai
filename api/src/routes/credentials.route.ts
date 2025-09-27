import { getAuth, requireAuth } from "@clerk/express";
import { Router } from "express";
import CredentialsService from "../services/credentials.service";

const router = Router()

router.use(requireAuth())

router.get("/", async (req, res) : Promise<any> => {
  try {
    const { nodeType } = req.query;
    const { userId } = getAuth(req);

    if (nodeType) {
      const allCredentials = await CredentialsService.getAllCredentialsByUserAndNodeType(userId!, String(nodeType));
      return res.status(200).json(allCredentials)
    } else {
      const allCredentials = await CredentialsService.getAllCredentialsByUser(userId!);
      return res.status(200).json(allCredentials)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({error :'Something went wrong'});
  }
})

router.get("/:id", async (req, res) : Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);

    const credentials = await CredentialsService.getCredentialsById(id, userId!);

    return res.status(200).json(credentials[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({error :'Something went wrong'});
  }
})

router.post("/", async (req, res) : Promise<any> => {
  try {
    const { userId } = getAuth(req);
    const credentialsBody = req.body;
    // TODO: body validation based on NodeType

    const newCredentials = await CredentialsService.createCredentials(credentialsBody, userId!);

    return res.status(200).json(newCredentials)
  } catch (error) {
    console.error(error)
    return res.status(500).json({error :'Something went wrong'});
  }
})

router.delete("/:id", async (req, res) : Promise<any> => {
  try {
    const { id } = req.params;
    // TODO: body validation based on NodeType
    const credentials = await CredentialsService.deleteCredentials(id);

    return res.status(200).json(credentials)
  } catch (error) {
    console.error(error)
    return res.status(500).json({error :'Something went wrong'});
  }
})

export default router;