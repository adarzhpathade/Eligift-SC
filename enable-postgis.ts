import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set');
}

const client = postgres(connectionString);

async function enablePostgis() {
  try {
    console.log('Enabling PostGIS extension...');
    await client`CREATE EXTENSION IF NOT EXISTS postgis;`;
    console.log('PostGIS extension enabled successfully.');
  } catch (error) {
    console.error('Error enabling PostGIS:', error);
  } finally {
    await client.end();
  }
}

enablePostgis();
