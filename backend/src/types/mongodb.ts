import { MongoClient, Db, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'your_db_name';

let db: Db;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(uri);
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Add type for documents with ObjectId
export interface WithId {
  _id: ObjectId;
}

// Export everything needed
export { connectToDatabase, db, ObjectId };
