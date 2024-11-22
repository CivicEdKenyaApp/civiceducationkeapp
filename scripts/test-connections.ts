import { testOpenAIConnection } from '../backend/src/config/openai';
import { connectToDatabase } from '../backend/src/config/mongodb';
import { testSupabaseConnection } from '../frontend/src/utils/supabaseClient';

async function testMongoDB() {
  try {
    const { client, db } = await connectToDatabase();
    await db.command({ ping: 1 });
    await client.close();
    console.log('✅ MongoDB connection successful');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
}

async function testAllConnections() {
  console.log('🔍 Testing all connections...\n');

  try {
    const openaiResult = await testOpenAIConnection();
    const mongoResult = await testMongoDB();
    const supabaseResult = await testSupabaseConnection();

    console.log('\n📊 Connection Test Results:');
    console.log(`OpenAI: ${openaiResult ? '✅' : '❌'}`);
    console.log(`MongoDB: ${mongoResult ? '✅' : '❌'}`);
    console.log(`Supabase: ${supabaseResult ? '✅' : '❌'}`);

    if (!openaiResult || !mongoResult || !supabaseResult) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Error testing connections:', error);
    process.exit(1);
  }
}

testAllConnections(); 