import postgres from 'postgres';

const sql = postgres('postgresql://postgres.zsrbqzsnjdzkhpszloww:Adarsh%40220605@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres');

async function deleteAllSchemes() {
  try {
    console.log('Deleting all schemes from the database...');
    const result = await sql`DELETE FROM schemes RETURNING id;`;
    console.log(`Successfully deleted ${result.length} scheme(s).`);
  } catch (error) {
    console.error('Error deleting schemes:', error);
  } finally {
    await sql.end();
  }
}

deleteAllSchemes();
