import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const mockPhone = cookieStore.get('dev_mock_auth')?.value;
  if (mockPhone) {
    // Generate deterministic UUID based on phone number
    const cleanPhone = mockPhone.replace(/\D/g, '').padStart(12, '0').slice(-12);
    const deterministicId = `00000000-0000-0000-0000-${cleanPhone}`;
    
    client.auth.getUser = async () => {
      return {
        data: {
          user: {
            id: deterministicId,
            phone: mockPhone,
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
          } as any
        },
        error: null
      };
    };
  }

  return client;
}
