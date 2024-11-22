import express from 'express';
import type { Request, Response } from 'express-serve-static-core';
import z = require('zod');
import openai from '../config/openai';
import { ObjectId, WithId } from '../types/mongodb';

const router = express.Router();

interface Contribution extends WithId {
  billId: ObjectId;
  content: string;
  type: 'url' | 'document' | 'description';
  url?: string;
  documentUrl?: string;
  authorId: ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  analysis?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Validation schema for contribution submission
const ContributionSchema = z.object({
  billId: z.string().transform((val: number) => new ObjectId(val)),
  content: z.string().min(1),
  type: z.enum(['url', 'document', 'description']),
  url: z.string().url().optional(),
  documentUrl: z.string().optional(),
  authorId: z.string().transform((val: number) => new ObjectId(val)),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
});

// Get all contributions for a bill
router.get('/bill/:billId', async (req: Request, res: Response) => {
  try {
    const { billId } = req.params;
    const contributions = await req.db
      .collection<Contribution>('contributions')
      .find({ 
        billId: new ObjectId(billId), 
        status: 'approved' 
      })
      .toArray();
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
});

// Submit a new contribution
router.post('/', async (req: Request, res: Response) => {
  try {
    const contributionData = ContributionSchema.parse(req.body);
    const analysis = await analyzeContribution(contributionData.content);

    const contribution = {
      ...contributionData,
      analysis,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await req.db.collection('contributions').insertOne(contribution);
    res.status(201).json({ ...result, contribution });
  } catch (error) {
    console.error('Error creating contribution:', error);
    res.status(500).json({ error: 'Failed to create contribution' });
  }
});

async function analyzeContribution(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analyze this contribution to a legislative bill and provide a brief, objective summary of its key points and potential impact."
        },
        {
          role: "user",
          content: `Analyze this contribution: ${content}`
        }
      ],
      max_tokens: 200,
    });

    return response.choices[0].message.content || 'No analysis available';
  } catch (error) {
    console.error('Error analyzing contribution:', error);
    return 'Analysis failed';
  }
}

export default router;