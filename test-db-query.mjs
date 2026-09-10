import { db } from './src/db/index.js';
import { schemes } from './src/db/schema/index.js';
import { eq } from 'drizzle-orm';

async function main() {
  try {
    const id = 'b5a846eb-dd19-4414-8fde-c09b996a6160';
    console.log(`Fetching scheme with id: ${id}`);
    const result = await db.select().from(schemes).where(eq(schemes.id, id)).limit(1);
    console.log('Result:', result);
  } catch (error) {
    console.error('Error fetching scheme:', error);
  }
  process.exit(0);
}

main();
