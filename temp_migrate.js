require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

async function migrate() {
  const sql = postgres(process.env.DATABASE_URL);
  try {
    await sql`ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "address" text;`;
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await sql.end();
  }
}

migrate();
