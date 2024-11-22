require('dotenv').config();

import express from 'express';
import cors from 'cors';
import { databaseMiddleware } from './middleware/database';
import billsRouter from './routes/bills';
import resourcesRouter from './routes/resources';
import contributionsRouter from './routes/contributions';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(databaseMiddleware);

// Routes
app.use('/api/bills', billsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/contributions', contributionsRouter);

export default app;