import { db } from '@/db'
import { profiles, schemes } from '@/db/schema'
import { eq, sql, and, gte, desc } from 'drizzle-orm'

/**
 * Maps profile occupation slugs → scheme occupation tag values.
 * The scheme data uses mixed-case tags like "Farmer", "Doctor", "Student".
 * The profile form saves lowercase slugs like "farmer", "doctor", "student".
 * This mapping bridges that gap and expands generic profile values
 * (e.g. "tech") into multiple applicable scheme tags.
 *
 * All mapped values are stored in lowercase for case-insensitive comparison.
 */
const OCCUPATION_MAP: Record<string, string[]> = {
  farmer: ['farmer', 'self-employed'],
  doctor: ['doctor', 'medical', 'healthcare'],
  student: ['student'],
  tech: ['salaried', 'self-employed'],
  healthcare: ['doctor', 'medical', 'healthcare', 'salaried'],
  education: ['salaried', 'student'],
  finance: ['salaried', 'self-employed'],
  government: ['salaried', 'government'],
  other: ['self-employed'],
}

/** Scoring weights — must sum to 100 */
const WEIGHTS = {
  occupation: 25,
  state: 20,
  age: 20,
  income: 15,
  gender: 10,
  education: 10,
} as const

/** Columns selected for recommendation scoring + display */
const RECOMMENDATION_COLUMNS = {
  id: schemes.id,
  title: schemes.title,
  description: schemes.description,
  ministry: schemes.ministry,
  startDate: schemes.startDate,
  endDate: schemes.endDate,
  category: schemes.category,
  targetGroup: schemes.targetGroup,
  occupationTags: schemes.occupationTags,
  stateTags: schemes.stateTags,
  genderTags: schemes.genderTags,
  educationTags: schemes.educationTags,
  ageMin: schemes.ageMin,
  ageMax: schemes.ageMax,
  incomeLimit: schemes.incomeLimit,
} as const

type RecommendationScheme = {
  id: string
  title: string
  description: string
  ministry: string
  startDate: string | null
  endDate: string | null
  category: string
  targetGroup: string
  occupationTags: string[]
  stateTags: string[]
  genderTags: string[]
  educationTags: string[]
  ageMin: number | null
  ageMax: number | null
  incomeLimit: string | null
}

type ScoredScheme = RecommendationScheme & {
  matchPercentage: number
}

export type UserAttributes = {
  age: number
  income: number
  occupationTags: string[]
  state: string
  gender: string
  education: string
  projectCost: number
}

export async function getUserAttributes(userId: string): Promise<UserAttributes | null> {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  })

  if (!profile) return null

  return {
    age: profile.age,
    income: profile.annualIncome ? parseFloat(profile.annualIncome.toString()) : 0,
    occupationTags: OCCUPATION_MAP[(profile.occupation ?? '').toLowerCase()] ?? [(profile.occupation ?? '').toLowerCase()],
    state: (profile.state ?? '').toLowerCase(),
    gender: (profile.gender ?? '').toLowerCase(),
    education: (profile.education ?? '').toLowerCase(),
    projectCost: profile.projectCost ? parseFloat(profile.projectCost.toString()) : 50000,
  }
}

export function getCasingVariations(str: string): string[] {
  if (!str) return []
  const lower = str.toLowerCase()
  const upper = str.toUpperCase()
  const title = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  const pascal = str.split(/[- ]/).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('-')
  const pascalSpace = str.split(/[- ]/).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ')
  return Array.from(new Set([lower, upper, title, pascal, pascalSpace]))
}

export function getArrayCasingVariations(arr: string[]): string[] {
  const result = new Set<string>()
  for (const str of arr) {
    if (!str) continue
    getCasingVariations(str).forEach(v => result.add(v))
  }
  return Array.from(result)
}

export function computeMatchScoreSql(userAttrs: UserAttributes) {
  const userGender = userAttrs.gender || ''
  const noGenderProvided = !userGender || userGender === 'prefer-not'
  const userEducation = userAttrs.education || ''
  const noEduProvided = !userEducation

  const userOccTagsVars = getArrayCasingVariations(userAttrs.occupationTags)
  const userOccTagsSql = userOccTagsVars.length > 0 
    ? sql.join(userOccTagsVars.map(t => sql`${t}`), sql`, `)
    : sql``

  const userStateVars = getCasingVariations(userAttrs.state)
  const userStateSql = userStateVars.length > 0
    ? sql.join(userStateVars.map(t => sql`${t}`), sql`, `)
    : sql``

  const userGenderVars = getCasingVariations(userGender)
  const userGenderSql = userGenderVars.length > 0
    ? sql.join(userGenderVars.map(t => sql`${t}`), sql`, `)
    : sql``

  const userEduVars = getCasingVariations(userEducation)
  const userEduSql = userEduVars.length > 0
    ? sql.join(userEduVars.map(t => sql`${t}`), sql`, `)
    : sql``

  return sql<number>`
    CASE 
      WHEN (
        -- State check (if 0, fail)
        (CASE 
          WHEN cardinality(${schemes.stateTags}) = 0 OR ${schemes.stateTags} && ARRAY['all', 'All', 'ALL']::text[] THEN 20
          WHEN ${userStateVars.length > 0 ? sql`${schemes.stateTags} && ARRAY[${userStateSql}]::text[]` : sql`false`} THEN 20
          ELSE 0 
        END) = 0
        OR
        -- Age check (if 0, fail)
        (CASE 
          WHEN ${schemes.ageMin} IS NULL AND ${schemes.ageMax} IS NULL THEN 20
          WHEN (${schemes.ageMin} IS NULL OR ${userAttrs.age} >= ${schemes.ageMin}) 
           AND (${schemes.ageMax} IS NULL OR ${userAttrs.age} <= ${schemes.ageMax}) THEN 20
          WHEN (${schemes.ageMin} IS NOT NULL AND ${userAttrs.age} >= ${schemes.ageMin} - 5 AND ${userAttrs.age} < ${schemes.ageMin}) 
            OR (${schemes.ageMax} IS NOT NULL AND ${userAttrs.age} <= ${schemes.ageMax} + 5 AND ${userAttrs.age} > ${schemes.ageMax}) THEN 10
          ELSE 0 
        END) = 0
        OR
        -- Income check (if 0, fail)
        (CASE 
          WHEN ${schemes.incomeLimit} IS NULL THEN 15
          WHEN ${userAttrs.income} <= ${schemes.incomeLimit}::numeric THEN 15
          ELSE 0 
        END) = 0
        OR
        -- Gender check (if 0, fail)
        (CASE 
          WHEN cardinality(${schemes.genderTags}) = 0 OR ${schemes.genderTags} && ARRAY['all', 'All', 'ALL']::text[] THEN 10
          WHEN ${noGenderProvided} THEN 10
          WHEN ${userGenderVars.length > 0 ? sql`${schemes.genderTags} && ARRAY[${userGenderSql}]::text[]` : sql`false`} THEN 10
          ELSE 0 
        END) = 0
      ) THEN 0
      ELSE ROUND(
        CASE 
          WHEN cardinality(${schemes.occupationTags}) = 0 OR ${schemes.occupationTags} && ARRAY['all', 'All', 'ALL']::text[] THEN 22
          WHEN ${userOccTagsVars.length > 0 ? sql`${schemes.occupationTags} && ARRAY[${userOccTagsSql}]::text[]` : sql`false`} THEN 25
          ELSE 0 
        END +
        CASE 
          WHEN cardinality(${schemes.stateTags}) = 0 OR ${schemes.stateTags} && ARRAY['all', 'All', 'ALL']::text[] THEN 20
          WHEN ${userStateVars.length > 0 ? sql`${schemes.stateTags} && ARRAY[${userStateSql}]::text[]` : sql`false`} THEN 20
          ELSE 0 
        END +
        CASE 
          WHEN ${schemes.ageMin} IS NULL AND ${schemes.ageMax} IS NULL THEN 20
          WHEN (${schemes.ageMin} IS NULL OR ${userAttrs.age} >= ${schemes.ageMin}) 
           AND (${schemes.ageMax} IS NULL OR ${userAttrs.age} <= ${schemes.ageMax}) THEN 20
          WHEN (${schemes.ageMin} IS NOT NULL AND ${userAttrs.age} >= ${schemes.ageMin} - 5 AND ${userAttrs.age} < ${schemes.ageMin}) 
            OR (${schemes.ageMax} IS NOT NULL AND ${userAttrs.age} <= ${schemes.ageMax} + 5 AND ${userAttrs.age} > ${schemes.ageMax}) THEN 10
          ELSE 0 
        END +
        CASE 
          WHEN ${schemes.incomeLimit} IS NULL THEN 15
          WHEN ${userAttrs.income} <= ${schemes.incomeLimit}::numeric THEN 15
          ELSE 0 
        END +
        CASE 
          WHEN cardinality(${schemes.genderTags}) = 0 OR ${schemes.genderTags} && ARRAY['all', 'All', 'ALL']::text[] THEN 10
          WHEN ${noGenderProvided} THEN 10
          WHEN ${userGenderVars.length > 0 ? sql`${schemes.genderTags} && ARRAY[${userGenderSql}]::text[]` : sql`false`} THEN 10
          ELSE 0 
        END +
        CASE 
          WHEN cardinality(${schemes.educationTags}) = 0 OR ${schemes.educationTags} && ARRAY['all', 'All', 'ALL']::text[] THEN 10
          WHEN ${noEduProvided} THEN 10
          WHEN ${userEduVars.length > 0 ? sql`${schemes.educationTags} && ARRAY[${userEduSql}]::text[]` : sql`false`} THEN 10
          ELSE 0 
        END
      )
    END
  `
}

export async function getRecommendedSchemes(userId: string): Promise<ScoredScheme[]> {
  const userAttrs = await getUserAttributes(userId)

  if (!userAttrs) {
    return []
  }

  const scoreSql = computeMatchScoreSql(userAttrs)

  const strictConditions = [
    eq(schemes.isActive, true),
    gte(scoreSql, 30)
  ]

  // Strict Gender Filter
  if (userAttrs.gender && userAttrs.gender !== 'prefer-not') {
    const genderVars = getCasingVariations(userAttrs.gender)
    const genderSql = genderVars.length > 0 ? sql.join(genderVars.map(t => sql`${t}`), sql`, `) : sql``
    strictConditions.push(
      sql`cardinality(${schemes.genderTags}) = 0 OR ${schemes.genderTags} && ARRAY['all', 'All', 'ALL']::text[] OR ${genderVars.length > 0 ? sql`${schemes.genderTags} && ARRAY[${genderSql}]::text[]` : sql`false`}`
    )
  }

  // Strict State Filter
  if (userAttrs.state) {
    const stateVars = getCasingVariations(userAttrs.state)
    const stateSql = stateVars.length > 0 ? sql.join(stateVars.map(t => sql`${t}`), sql`, `) : sql``
    strictConditions.push(
      sql`cardinality(${schemes.stateTags}) = 0 OR ${schemes.stateTags} && ARRAY['all', 'All', 'ALL']::text[] OR ${stateVars.length > 0 ? sql`${schemes.stateTags} && ARRAY[${stateSql}]::text[]` : sql`false`}`
    )
  }

  // Strict Age Filter
  if (userAttrs.age) {
    strictConditions.push(
      sql`(${schemes.ageMin} IS NULL OR ${userAttrs.age} >= ${schemes.ageMin}) AND (${schemes.ageMax} IS NULL OR ${userAttrs.age} <= ${schemes.ageMax})`
    )
  }

  // Strict Income Filter
  if (userAttrs.income > 0) {
    strictConditions.push(
      sql`(${schemes.incomeLimit} IS NULL OR ${userAttrs.income} <= ${schemes.incomeLimit}::numeric)`
    )
  }

  const results = await db
    .select({
      ...RECOMMENDATION_COLUMNS,
      matchPercentage: scoreSql
    })
    .from(schemes)
    .where(and(...strictConditions))
    .orderBy(desc(scoreSql))

  return results as ScoredScheme[]
}

// ────────────────────────────────────────────────────────────────
// Scoring Engine
// ────────────────────────────────────────────────────────────────

/** Minimal shape required by the scoring functions */
type ScoringInput = {
  occupationTags: string[]
  stateTags: string[]
  genderTags: string[]
  educationTags: string[]
  ageMin: number | null
  ageMax: number | null
  incomeLimit: string | null
}

export function computeMatchScore(
  scheme: ScoringInput,
  user: UserAttributes
): number {
  const occupation = scoreOccupation(scheme, user)
  const state = scoreState(scheme, user)
  const age = scoreAge(scheme, user)
  const income = scoreIncome(scheme, user)
  const gender = scoreGender(scheme, user)
  const education = scoreEducation(scheme, user)

  // Strict Disqualifiers
  // If the engine determined a 0 for these hard constraints, the user is completely ineligible.
  if (gender === 0) return 0
  if (state === 0) return 0
  if (income === 0) return 0
  if (age === 0) return 0

  const total = occupation + state + age + income + gender + education

  return Math.round(total)
}

/**
 * Helper: normalize an array of tags to lowercase for comparison.
 * Treats "All" as a wildcard indicator.
 */
function normalizeTags(tags: string[]): string[] {
  return tags.map((t) => t.toLowerCase().trim())
}

function hasWildcard(normalizedTags: string[]): boolean {
  return normalizedTags.includes('all')
}

// ── Occupation (25 pts) ──

function scoreOccupation(
  scheme: ScoringInput,
  user: UserAttributes
): number {
  const tags = normalizeTags(scheme.occupationTags)

  // No tags or wildcard "All" → open to everyone, near-full credit (22/25)
  if (tags.length === 0 || hasWildcard(tags)) return 22

  // Check if any user occupation tag matches any scheme tag
  const matched = user.occupationTags.some((ut) => tags.includes(ut))
  return matched ? WEIGHTS.occupation : 0
}

// ── State (20 pts) ──

function scoreState(
  scheme: ScoringInput,
  user: UserAttributes
): number {
  const tags = normalizeTags(scheme.stateTags)

  if (tags.length === 0 || hasWildcard(tags)) return WEIGHTS.state

  const matched = tags.includes(user.state)
  return matched ? WEIGHTS.state : 0
}

// ── Age (20 pts) ──

function scoreAge(
  scheme: ScoringInput,
  user: UserAttributes
): number {
  const min = scheme.ageMin
  const max = scheme.ageMax

  // No age constraints → open to all, full credit
  if (min === null && max === null) return WEIGHTS.age

  const withinMin = min === null || user.age >= min
  const withinMax = max === null || user.age <= max

  if (withinMin && withinMax) return WEIGHTS.age

  // Near boundary (within 5 years) → partial credit
  const AGE_MARGIN = 5
  const nearMin = min !== null && user.age >= min - AGE_MARGIN && user.age < min
  const nearMax = max !== null && user.age <= max + AGE_MARGIN && user.age > max

  if (nearMin || nearMax) return WEIGHTS.age * 0.5

  return 0
}

// ── Income (15 pts) ──

function scoreIncome(
  scheme: ScoringInput,
  user: UserAttributes
): number {
  const incomeLimit = scheme.incomeLimit ? parseFloat(scheme.incomeLimit.toString()) : null

  // No income constraints → open to all, full credit
  if (incomeLimit === null) return WEIGHTS.income

  const belowMax = user.income <= incomeLimit

  if (belowMax) return WEIGHTS.income

  return 0
}

// ── Gender (10 pts) ──

function scoreGender(
  scheme: ScoringInput,
  user: UserAttributes
): number {
  const tags = normalizeTags(scheme.genderTags)

  if (tags.length === 0 || hasWildcard(tags)) return WEIGHTS.gender

  // If user hasn't specified gender, don't penalize if scheme explicitly wants a gender
  if (!user.gender || user.gender === 'prefer-not') return WEIGHTS.gender

  const matched = tags.includes(user.gender)
  return matched ? WEIGHTS.gender : 0
}

// ── Education (10 pts) ──

function scoreEducation(
  scheme: ScoringInput,
  user: UserAttributes
): number {
  const tags = normalizeTags(scheme.educationTags)

  if (tags.length === 0 || hasWildcard(tags)) return WEIGHTS.education

  // If user hasn't specified education, don't penalize
  if (!user.education) return WEIGHTS.education

  const matched = tags.includes(user.education)
  return matched ? WEIGHTS.education : 0
}
