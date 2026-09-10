import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schemes } from './src/db/schema/index.js';

import { seedSchemes } from './scheme-db/gemini-code-1781722013619.js';
import { seedSchemesBatch2 } from './scheme-db/gemini-code-1781722076916.js';
import { seedSchemesBatch3 } from './scheme-db/gemini-code-1781722191606.js';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.zsrbqzsnjdzkhpszloww:Adarsh%40220605@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres';
const client = postgres(connectionString);
const db = drizzle(client);

const ALL_SCHEMES = [...seedSchemes, ...seedSchemesBatch2, ...seedSchemesBatch3];

async function seed() {
  console.log(`Starting to seed ${ALL_SCHEMES.length} schemes...`);
  try {
    for (const scheme of ALL_SCHEMES) {
      await db.insert(schemes)
        .values(scheme)
        .onConflictDoUpdate({
          target: schemes.slug,
          set: scheme,
        });
      console.log(`Upserted scheme: ${scheme.slug}`);
    }
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding schemes:', error);
  } finally {
    await client.end();
  }
}

seed();
