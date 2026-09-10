import postgres from 'postgres';

const sql = postgres('postgresql://postgres.zsrbqzsnjdzkhpszloww:Adarsh%40220605@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres');

async function confirmEmail() {
  try {
    console.log('Confirming email...');
    const result = await sql`
      UPDATE auth.users 
      SET email_confirmed_at = NOW() 
      WHERE email = 'admin@eligify.com'
      RETURNING id;
    `;
    console.log('Update result:', result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sql.end();
  }
}

confirmEmail();
