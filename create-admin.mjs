import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zsrbqzsnjdzkhpszloww.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_VwD8nnvj10ed-wHokGdneQ_0hMHlTlO';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdmin() {
  const email = 'admin@eligify.com';
  const password = 'AdminPassword123!';

  console.log(`Creating user: ${email}...`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('User created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    if (data.user?.identities?.length === 0) {
       console.log('Note: User already existed.');
    }
  }
}

createAdmin();
