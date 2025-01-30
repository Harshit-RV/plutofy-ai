import express, { Application, NextFunction, Request, Response, } from 'express';
import mongoose from 'mongoose';
import agentRoutes from './routes/agent.route';
import completionRoutes from './routes/completion.route'
import config from './config';
import "dotenv/config";
import cors from 'cors'; 

const app: Application = express();

// Middleware
app.use(express.json());

app.use(cors());

// Connect to MongoDB
mongoose.connect(config.mongoURI);


// Routes
// app.use('/', homeRoutes);
app.use('/agent', agentRoutes);
app.use('/v1/completion', completionRoutes);


app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(401).send(err);
});

// Start the server
app.listen(8080, () => {
  console.log(`Server running on port 8080`);
});