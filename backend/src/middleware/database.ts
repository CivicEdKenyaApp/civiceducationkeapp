import type { Request, Response, NextFunction } from 'express-serve-static-core';
import { MongoClient } from 'mongodb';

let client: MongoClient;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
  }
  return client.db('civic_education');
}

export async function databaseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const db = await connectDB();
    req.db = db;
    next();
  } catch (error) {
    console.error('Database middleware error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
} 