import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('civic_education');
    
    await db.command({ ping: 1 });
    console.log('Successfully connected to MongoDB!');
    
    await client.close();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

testConnection(); 