import { config } from 'dotenv'
import postgres from 'postgres'
import * as fs from 'fs'

config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const client = postgres(process.env.DATABASE_URL)

async function apply() {
  const sqlContent = fs.readFileSync('src/db/migrations/0002_add_hi_columns.sql', 'utf-8')
  console.log('Applying migration...')
  try {
    await client.unsafe(sqlContent)
    console.log('Migration applied successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await client.end()
  }
}

apply()
