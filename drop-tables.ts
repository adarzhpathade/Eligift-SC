import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set');
}

const client = postgres(connectionString);

async function dropDrizzle() {
  try {
    console.log('Dropping drizzle schema...');
    await client`DROP SCHEMA IF EXISTS drizzle CASCADE;`;
    console.log('Drizzle schema dropped.');
  } catch (error) {
    console.error('Error dropping drizzle schema:', error);
  } finally {
    await client.end();
  }
}

dropDrizzle();
