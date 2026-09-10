import { db } from '@/db'
import { schemes } from '@/db/schema'
import { and, ilike, eq, or, sql, desc, asc, lte, gte, getTableColumns } from 'drizzle-orm'
import { UserAttributes, computeMatchScoreSql } from '@/services/recommendation'

export type SchemeFilters = {
  q?: string
  state?: string
  occupation?: string
  gender?: string
  age?: number
  income?: number
  sort?: string // 'newest', 'closing-soon', 'alphabetical', 'match'
  page?: number
  fetchAll?: boolean
  userAttrs?: UserAttributes | null
}

const ITEMS_PER_PAGE = 20

export async function getFilteredSchemes(filters: SchemeFilters) {
  const { q, state, occupation, gender, age, income, sort, page = 1, fetchAll = false, userAttrs } = filters
  const offset = (page - 1) * ITEMS_PER_PAGE

  const conditions = [eq(schemes.isActive, true)]

  if (q) {
    conditions.push(
      or(
        ilike(schemes.title, `%${q}%`),
        ilike(schemes.description, `%${q}%`)
      )!
    )
  }

  if (state) {
    conditions.push(sql`cardinality(${schemes.stateTags}) = 0 OR ${schemes.stateTags} @> ARRAY[${state}]::text[]`)
  }

  if (occupation) {
    conditions.push(sql`cardinality(${schemes.occupationTags}) = 0 OR ${schemes.occupationTags} @> ARRAY[${occupation}]::text[]`)
  }

  if (gender) {
    conditions.push(sql`cardinality(${schemes.genderTags}) = 0 OR ${schemes.genderTags} @> ARRAY[${gender}]::text[]`)
  }

  if (age !== undefined && !isNaN(age)) {
    conditions.push(or(sql`${schemes.ageMin} IS NULL`, lte(schemes.ageMin, age))!)
    conditions.push(or(sql`${schemes.ageMax} IS NULL`, gte(schemes.ageMax, age))!)
  }

  if (income !== undefined && !isNaN(income)) {
    conditions.push(or(sql`${schemes.incomeLimit} IS NULL`, gte(schemes.incomeLimit, income.toString()))!)
  }

  let orderBy = [desc(schemes.createdAt)]
  if (sort === 'closing-soon') {
    orderBy = [asc(schemes.endDate)]
  } else if (sort === 'alphabetical') {
    orderBy = [asc(schemes.title)]
  }

  let scoreSql = sql<number>`0`
  if (userAttrs) {
    scoreSql = computeMatchScoreSql(userAttrs)
  }

  const selectFields = {
    ...getTableColumns(schemes),
    ...(userAttrs ? { matchPercentage: scoreSql } : {})
  }

  if (sort === 'match' && userAttrs) {
    orderBy = [desc(scoreSql)]
  }

  let query = db
    .select(selectFields)
    .from(schemes)
    .where(and(...conditions))
    .orderBy(...orderBy)
    .$dynamic()

  if (!fetchAll) {
    query = query.limit(ITEMS_PER_PAGE).offset(offset)
  }

  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(schemes)
    .where(and(...conditions))

  const [data, [{ count }]] = await Promise.all([query, countQuery])

  return {
    data,
    totalCount: Number(count),
    totalPages: Math.ceil(Number(count) / ITEMS_PER_PAGE),
    currentPage: page
  }
}

export async function getSchemeById(id: string) {
  const result = await db
    .select()
    .from(schemes)
    .where(eq(schemes.id, id))
    .limit(1)

  return result[0] || null
}

export async function getSimilarSchemes(schemeId: string, limit = 3) {
  const currentScheme = await getSchemeById(schemeId)
  if (!currentScheme) return []

  const result = await db
    .select()
    .from(schemes)
    .where(
      and(
        eq(schemes.isActive, true),
        or(
          eq(schemes.category, currentScheme.category),
          eq(schemes.targetGroup, currentScheme.targetGroup)
        ),
        sql`${schemes.id} != ${schemeId}`
      )
    )
    .orderBy(desc(schemes.createdAt))
    .limit(limit)

  return result
}

export async function getAllActiveSchemes() {
  return await db
    .select()
    .from(schemes)
    .where(eq(schemes.isActive, true))
    .orderBy(asc(schemes.title))
}
