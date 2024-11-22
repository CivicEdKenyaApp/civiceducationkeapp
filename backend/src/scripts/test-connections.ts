import { MongoClient } from 'mongodb';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Ensure required environment variables are present
const requiredEnvVars = {
  MONGODB_URI: process.env.MONGODB_URI,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
};

// Check for missing environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`${key} is not defined in environment variables`);
  }
});

async function testMongoDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('civic_education');
    
    // Test the connection
    await db.command({ ping: 1 });
    console.log('✅ MongoDB connection successful');
    
    // Create test collections if they don't exist
    const collections = ['bills', 'resources', 'contributions'];
    for (const collection of collections) {
      if (!(await db.listCollections({ name: collection }).hasNext())) {
        await db.createCollection(collection);
        console.log(`Created collection: ${collection}`);
      }
    }
    
    await client.close();
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
}

async function testOpenAI() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY as string
    });
    
    await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Test connection" }],
    });
    
    console.log('✅ OpenAI connection successful');
    return true;
  } catch (error) {
    console.error('❌ OpenAI connection failed:', error);
    return false;
  }
}

async function testSupabase() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
    
    const { error } = await supabase.from('test').select('count').single();
    if (error) throw error;
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}

async function testAllConnections() {
  console.log('🔍 Testing all connections...\n');

  const results = await Promise.all([
    testMongoDB(),
    testOpenAI(),
    testSupabase()
  ]);

  console.log('\n📊 Connection Test Results:');
  console.log(`MongoDB: ${results[0] ? '✅' : '❌'}`);
  console.log(`OpenAI: ${results[1] ? '✅' : '❌'}`);
  console.log(`Supabase: ${results[2] ? '✅' : '❌'}`);

  if (results.some(result => !result)) {
    console.error('\n❌ Some connections failed. Please check the errors above.');
    process.exit(1);
  }

  console.log('\n✅ All connections successful!');
}

// Run tests if this file is being run directly
if (require.main === module) {
  testAllConnections().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export {
  testMongoDB,
  testOpenAI,
  testSupabase,
  testAllConnections
}; 