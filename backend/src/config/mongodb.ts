import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db('civic_education');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function initializeDatabase() {
  const { db } = await connectToDatabase();

  // Define collections
  const collections = [
    {
      name: 'bills',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title', 'content', 'status'],
          properties: {
            title: { bsonType: 'string' },
            content: { bsonType: 'string' },
            status: { enum: ['pending', 'active', 'passed', 'rejected'] }
          }
        }
      }
    },
    {
      name: 'resources',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title', 'type', 'url'],
          properties: {
            title: { bsonType: 'string' },
            type: { enum: ['PDF', 'Video', 'Infographic', 'Article'] },
            url: { bsonType: 'string' }
          }
        }
      }
    },
    {
      name: 'contributions',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['billId', 'content', 'type'],
          properties: {
            billId: { bsonType: 'objectId' },
            content: { bsonType: 'string' },
            type: { enum: ['url', 'document', 'description'] }
          }
        }
      }
    }
  ];

  // Create collections with validators
  for (const collection of collections) {
    try {
      await db.createCollection(collection.name, {
        validator: collection.validator
      });
      console.log(`Created collection: ${collection.name}`);
    } catch (error: any) {
      // Skip if collection already exists
      if (error.code !== 48) {
        console.error(`Error creating collection ${collection.name}:`, error);
      }
    }
  }

  // Create indexes
  await db.collection('bills').createIndex({ title: 'text', content: 'text' });
  await db.collection('resources').createIndex({ title: 'text', type: 1 });
  await db.collection('contributions').createIndex({ billId: 1 });

  return db;
} 