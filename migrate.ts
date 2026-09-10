import { config } from 'dotenv';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set');
}

const client = postgres(connectionString);

async function migrate() {
  try {
    console.log('Running migration...');
    const migrationsDir = path.join(process.cwd(), 'src/db/migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
    if (files.length === 0) {
      console.log('No SQL files found.');
      return;
    }
    
    // Sort just in case, though there should only be one 0000_...sql
    files.sort();
    
    for (const file of files) {
      console.log(`Executing ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await client.unsafe(sql);
      console.log(`Successfully executed ${file}`);
    }
    
    console.log('Migration complete.');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await client.end();
  }
}

migrate();
