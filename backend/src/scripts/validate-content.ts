import { MongoClient, ObjectId } from 'mongodb';
import z = require('zod');
import dotenv from 'dotenv';

dotenv.config();

// Define base schema for common fields
const BaseSchema = z.object({
  _id: z.custom<ObjectId>(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

// Validation schemas
const BillSchema = BaseSchema.extend({
  title: z.string().min(1),
  content: z.string().min(1),
  summary: z.string().optional(),
  sectors: z.array(z.string()).optional(),
  status: z.enum(['pending', 'active', 'passed', 'rejected']),
  processed: z.boolean().optional().default(false)
});

const ResourceSchema = BaseSchema.extend({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['PDF', 'Video', 'Infographic', 'Article']),
  url: z.string().url(),
  tags: z.array(z.string()).optional(),
  offlineAvailable: z.boolean().default(false)
});

// Type inference
type Bill = z.infer<typeof BillSchema>;
type Resource = z.infer<typeof ResourceSchema>;

async function validateContent() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db('civic_education');
  
  try {
    // Validate bills
    const bills = await db.collection<Bill>('bills').find({}).toArray();
    console.log(`Validating ${bills.length} bills...`);
    
    const invalidBills = bills.filter(bill => {
      try {
        BillSchema.parse({
          ...bill,
          _id: bill._id,
          createdAt: bill.createdAt,
          updatedAt: bill.updatedAt
        });
        return false;
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(`Invalid bill ${bill._id}:`, error.errors);
        } else {
          console.error(`Invalid bill ${bill._id}:`, error);
        }
        return true;
      }
    });

    // Validate resources
    const resources = await db.collection<Resource>('resources').find({}).toArray();
    console.log(`Validating ${resources.length} resources...`);
    
    const invalidResources = resources.filter(resource => {
      try {
        ResourceSchema.parse({
          ...resource,
          _id: resource._id,
          createdAt: resource.createdAt,
          updatedAt: resource.updatedAt
        });
        return false;
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(`Invalid resource ${resource._id}:`, error.errors);
        } else {
          console.error(`Invalid resource ${resource._id}:`, error);
        }
        return true;
      }
    });

    // Report results
    console.log('\n📊 Validation Results:');
    console.log(`Bills: ${bills.length - invalidBills.length} valid, ${invalidBills.length} invalid`);
    console.log(`Resources: ${resources.length - invalidResources.length} valid, ${invalidResources.length} invalid`);

    if (invalidBills.length > 0 || invalidResources.length > 0) {
      console.error('\n❌ Validation failed. See above for details.');
      process.exit(1);
    }

    console.log('\n✅ All content validated successfully!');
  } catch (error) {
    console.error('Validation failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Add error handling for the main function
if (require.main === module) {
  validateContent()
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default validateContent; 