import express, { Application, NextFunction, Request, Response, } from 'express';
import mongoose from 'mongoose';
import agentRoutes from './routes/agent.route';
import completionRoutes from './routes/completion.route'
import apiKeyRoutes from './routes/apiKey.route';
import config from './config';
import "dotenv/config";
import cors from 'cors'; 
import { clerkMiddleware } from '@clerk/express';
import { createClerkClient } from '@clerk/backend'

const app: Application = express();

// Middleware
app.use(express.json());

app.use(cors());

// Connect to MongoDB
mongoose.connect(config.mongoURI);

export const clerkClient = createClerkClient({ 
  secretKey: config.clerkSecretKey, 
  publishableKey: config.clerkPublishableKey,
});

app.use(clerkMiddleware({ clerkClient }));
// Routes
// app.use('/', homeRoutes);
app.use('/agent', agentRoutes);
app.use('/apikey', apiKeyRoutes);
app.use('/v1/completion', completionRoutes);


app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});