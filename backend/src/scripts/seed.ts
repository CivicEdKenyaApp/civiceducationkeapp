import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const seedData = {
  bills: [
    {
      title: "Education Reform Act 2023",
      content: "A bill to reform the education system...",
      sector: "Education",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  resources: [
    {
      title: "Civic Education Guide",
      description: "Comprehensive guide to civic education in Kenya",
      type: "PDF",
      url: "https://example.com/guide.pdf",
      tags: ["education", "civic", "guide"],
      offlineAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

async function seed() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('civic_education');

    // Clear existing data
    await Promise.all([
      db.collection('bills').deleteMany({}),
      db.collection('resources').deleteMany({})
    ]);

    // Insert seed data
    await Promise.all([
      db.collection('bills').insertMany(seedData.bills),
      db.collection('resources').insertMany(seedData.resources)
    ]);

    console.log('✅ Database seeded successfully');
    await client.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed(); 