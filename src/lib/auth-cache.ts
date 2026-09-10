import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Cached auth user retrieval.
 *
 * React `cache()` deduplicates calls within the same server request.
 * Layout, page, and server actions that all call `getAuthUser()` in
 * the same render will share a single Supabase auth round-trip.
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null
  return user
})

/**
 * Cached profile retrieval.
 *
 * Depends on `getAuthUser()` — if no user is authenticated,
 * returns null immediately without hitting the DB.
 */
export const getProfile = cache(async () => {
  const user = await getAuthUser()
  if (!user) return null

  const result = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1)

  return result[0] ?? null
})
