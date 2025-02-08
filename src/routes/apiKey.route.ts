import express from 'express';
import { 
  createNewApiKey, 
  getApiKeysByUserId, 
  getApiKeyById, 
  deleteApiKey, 
  updateApiKey 
} from '../services/apiKey.service';
import { isValidObjectId } from 'mongoose';
import { getAuth, requireAuth } from '@clerk/express';

const router = express.Router();
router.use(requireAuth());

// Create a new API key
router.post('/create', async (req, res) : Promise<any> => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).end();

    const { name, access } = req.body;
    if (!name) return res.status(400).json({ message: 'Missing required fields' });

    const apiKey = await createNewApiKey({ userId, name, access });
    return res.status(201).json(apiKey);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get API keys for the authenticated user
router.get('/list', async (req, res) : Promise<any> => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).end();

    const apiKeys = await getApiKeysByUserId(userId);
    return res.json(apiKeys.map(({ id, name, createdAt, access }) => ({ id, name, createdAt, access })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/delete', async (req, res) : Promise<any> => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).end();

    const { apiKeyId } = req.body;
    if (!apiKeyId || !isValidObjectId(apiKeyId)) {
      return res.status(400).json({ message: 'Invalid API key ID' });
    }

    const apiKey = await getApiKeyById(apiKeyId);
    if (!apiKey || apiKey.userId !== userId) {
      return res.status(404).json({ message: 'API key not found' });
    }

    await deleteApiKey(apiKeyId);
    return res.status(200).json({ message: 'API key deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});


// Get API key by ID
// router.get('/:id', async (req, res) : Promise<any> => {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) return res.status(401).end();
//     const { id } = req.params;
//     if (!isValidObjectId(id)) return res.status(404).json({ message: 'Invalid API key ID' });
//     const apiKey = await getApiKeyById(id);
//     if (!apiKey || apiKey.userId !== userId) {
//       return res.status(404).json({ message: 'API key not found' });
//     }
//     return res.json(apiKey);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Something went wrong' });
//   }
// });

// Delete an API key


// Update an API key (e.g., change access permissions)
// router.post('/update', async (req, res) : Promise<any> => {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) return res.status(401).end();
//     const { apiKeyId, updateFields } = req.body;
//     if (!apiKeyId || !updateFields || !isValidObjectId(apiKeyId)) {
//       return res.status(400).json({ message: 'Invalid request data' });
//     }
//     const apiKey = await getApiKeyById(apiKeyId);
//     if (!apiKey || apiKey.userId !== userId) {
//       return res.status(404).json({ message: 'API key not found' });
//     }
//     const updatedApiKey = await updateApiKey(apiKeyId, updateFields);
//     return res.json(updatedApiKey);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Something went wrong' });
//   }
// });

export default router;
