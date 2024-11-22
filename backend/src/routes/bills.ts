import express from 'express';
import type { Request, Response } from 'express';
import z = require('zod');
import { ObjectId } from 'mongodb';
import openai from '../config/openai';

const router = express.Router();

// Validation schema for bill submission
const BillSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  sector: z.string().optional(),
  status: z.enum(['pending', 'active', 'passed', 'rejected']).default('pending'),
});

type Bill = z.infer<typeof BillSchema> & {
  _id?: ObjectId;
  summary?: string;
  sectors?: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Get all bills with optional sector filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { sector } = req.query;
    const query = sector ? { sector } : {};
    const bills = await req.db.collection<Bill>('bills').find(query).toArray();
    res.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Submit a new bill
router.post('/', async (req: Request, res: Response) => {
  try {
    const billData = BillSchema.parse(req.body);

    // Generate summary using OpenAI
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Summarize this Kenyan legislative bill in simple, clear language for citizens."
        },
        {
          role: "user",
          content: billData.content
        }
      ],
      max_tokens: 250
    });

    // Generate sector categorization
    const sectorResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Categorize this bill into relevant sectors (e.g., Education, Health, Economy). Return as comma-separated list."
        },
        {
          role: "user",
          content: billData.content
        }
      ],
      max_tokens: 100
    });

    const bill: Bill = {
      ...billData,
      summary: summaryResponse.choices[0].message.content || undefined,
      sectors: sectorResponse.choices[0].message.content?.split(',').map(s => s.trim()),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await req.db.collection<Bill>('bills').insertOne(bill);
    res.status(201).json({ ...result, bill });
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Failed to create bill' });
  }
});

export default router;
