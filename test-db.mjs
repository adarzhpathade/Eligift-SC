import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres('postgresql://postgres:Rub%2FrH78%2Bj%2A4k2h@db.bcpwsvstzarqufwguyod.supabase.co:5432/postgres');
const db = drizzle(queryClient);

async function test() {
  try {
    await queryClient`SELECT 1`;
    console.log("SUCCESS");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

test();
