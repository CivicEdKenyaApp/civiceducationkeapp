import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function testMongoDBConnection() {
  let client: MongoClient | undefined;

  try {
    // Check if MongoDB URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔍 Testing MongoDB connection...');

    // Attempt to connect
    client = await MongoClient.connect(process.env.MONGODB_URI);
    
    // Test the connection with a ping
    const db = client.db('civic_education');
    await db.command({ ping: 1 });

    // Check for required collections
    const collections = ['bills', 'resources', 'contributions'];
    const existingCollections = await db.listCollections().toArray();
    const existingCollectionNames = existingCollections.map(col => col.name);

    console.log('\n📊 Collections Status:');
    for (const collection of collections) {
      const exists = existingCollectionNames.includes(collection);
      console.log(`${exists ? '✅' : '❌'} ${collection}`);
    }

    console.log('\n✅ MongoDB connection successful!');
    console.log(`📍 Connected to: ${process.env.MONGODB_URI}`);
    console.log(`📁 Database: ${db.databaseName}`);

    return true;
  } catch (error) {
    console.error('\n❌ MongoDB connection failed:', error);
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connection closed');
    }
  }
}

// Run the test if this file is being run directly
if (require.main === module) {
  testMongoDBConnection()
    .then(success => {
      if (!success) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default testMongoDBConnection; 