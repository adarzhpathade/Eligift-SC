import postgres from 'postgres';

const sql = postgres('postgresql://postgres.zsrbqzsnjdzkhpszloww:Adarsh%40220605@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres');

async function setupTrigger() {
  try {
    console.log('Setting up auto-confirm trigger...');
    await sql`
      CREATE OR REPLACE FUNCTION public.auto_confirm_user()
      RETURNS trigger AS $$
      BEGIN
        NEW.email_confirmed_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    await sql`
      DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;
    `;
    await sql`
      CREATE TRIGGER auto_confirm_user_trigger
      BEFORE INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();
    `;
    console.log('Trigger created successfully. New users will be automatically confirmed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sql.end();
  }
}

setupTrigger();
