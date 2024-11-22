import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  content?: string;
}

async function prepareOfflineContent() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db('civic_education');
  
  try {
    // Create offline content directory
    const offlineDir = path.join(__dirname, '../../public/offline');
    await fs.mkdir(offlineDir, { recursive: true });

    // Prepare bills for offline access
    const bills = await db.collection('bills')
      .find({ status: 'active' })
      .toArray();

    const offlineBills = bills.map(bill => ({
      id: bill._id,
      title: bill.title,
      summary: bill.summary,
      content: bill.content,
      sectors: bill.sectors
    }));

    await fs.writeFile(
      path.join(offlineDir, 'bills.json'),
      JSON.stringify(offlineBills, null, 2)
    );

    // Prepare resources for offline access
    const resources = await db.collection<Resource>('resources')
      .find({ offlineAvailable: true })
      .toArray();

    const offlineResources = resources.map(resource => ({
      id: resource._id,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      localPath: `offline/resources/${resource._id}`
    }));

    await fs.writeFile(
      path.join(offlineDir, 'resources.json'),
      JSON.stringify(offlineResources, null, 2)
    );

    // Create manifest
    const manifest = {
      version: new Date().toISOString(),
      bills: offlineBills.length,
      resources: offlineResources.length,
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(
      path.join(offlineDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    console.log('✅ Offline content prepared successfully');
    console.log(`📊 Stats:
      - Bills: ${offlineBills.length}
      - Resources: ${offlineResources.length}
      - Last Updated: ${manifest.lastUpdated}
    `);
  } catch (error) {
    console.error('Failed to prepare offline content:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

prepareOfflineContent().catch(console.error); 