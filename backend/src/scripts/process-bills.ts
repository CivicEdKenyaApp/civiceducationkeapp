import { MongoClient, ObjectId } from 'mongodb';
import openai from '../config/openai';
import dotenv from 'dotenv';

dotenv.config();

interface Bill {
  _id: ObjectId;
  title: string;
  content: string;
  summary?: string;
  sectors?: string[];
  status: string;
  processed: boolean;
}

async function processBills() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db('civic_education');
  
  try {
    // Get unprocessed bills
    const bills = await db.collection<Bill>('bills')
      .find({ processed: { $ne: true } })
      .toArray();

    console.log(`Found ${bills.length} bills to process`);

    for (const bill of bills) {
      try {
        // Generate summary using OpenAI
        const summaryResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Summarize this Kenyan legislative bill in simple, clear language for citizens."
            },
            {
              role: "user",
              content: bill.content
            }
          ],
          max_tokens: 250
        });

        // Generate sector categorization
        const sectorResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Categorize this bill into relevant sectors (e.g., Education, Health, Economy). Return as comma-separated list."
            },
            {
              role: "user",
              content: bill.content
            }
          ],
          max_tokens: 100
        });

        // Update bill with processed information
        await db.collection<Bill>('bills').updateOne(
          { _id: bill._id },
          {
            $set: {
              summary: summaryResponse.choices[0].message.content,
              sectors: sectorResponse.choices[0].message.content?.split(',').map(s => s.trim()),
              processed: true,
              updatedAt: new Date()
            }
          }
        );

        console.log(`✅ Processed bill: ${bill.title}`);
      } catch (error) {
        console.error(`❌ Error processing bill ${bill.title}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to process bills:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Add error handling for the main function
if (require.main === module) {
  processBills()
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default processBills; 