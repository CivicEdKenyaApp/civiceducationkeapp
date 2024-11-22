import express from 'express';
import type { Request, Response } from 'express-serve-static-core';
import z = require('zod');
import openai from '../config/openai';
import { WithId } from '../types/mongodb';

const router = express.Router();

interface Resource extends WithId {
  title: string;
  description: string;
  type: 'PDF' | 'Video' | 'Infographic' | 'Article';
  url: string;
  tags?: string[];
  offlineAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Validation schema for resource submission
const ResourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['PDF', 'Video', 'Infographic', 'Article']),
  url: z.string().url(),
  tags: z.array(z.string()).optional(),
  offlineAvailable: z.boolean().default(false),
});

// Get all resources with optional type filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const query = type ? { type: type as Resource['type'] } : {};
    const resources = await req.db
      .collection<Resource>('resources')
      .find(query)
      .toArray();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Submit a new resource
router.post('/', async (req: Request, res: Response) => {
  try {
    const resourceData = ResourceSchema.parse(req.body);
    const tags = await generateTags(resourceData.description);

    const resource = {
      ...resourceData,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await req.db
      .collection<Resource>('resources')
      .insertOne(resource as Resource);
    res.status(201).json({ ...result, resource });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

async function generateTags(content: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Generate relevant tags for civic education content. Return only the tags as a comma-separated list."
        },
        {
          role: "user",
          content: `Generate tags for this content: ${content}`
        }
      ],
      max_tokens: 100,
    });

    return response.choices[0].message.content?.split(',').map(s => s.trim()) || [];
  } catch (error) {
    console.error('Error generating tags:', error);
    return [];
  }
}

export default router;