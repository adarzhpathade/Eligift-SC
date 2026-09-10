import { pgTable, uuid, timestamp, text, integer, numeric, boolean, date, jsonb, index, unique, geometry } from 'drizzle-orm/pg-core'

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  fullName: text('full_name').notNull(),
  age: integer('age').notNull(),
  gender: text('gender'),
  state: text('state').notNull(),
  district: text('district'),
  address: text('address'),
  occupation: text('occupation').notNull(),
  employmentStatus: text('employment_status'),
  annualIncome: numeric('annual_income'),
  education: text('education'),
  preferredLanguage: text('preferred_language'),
  purpose: text('purpose'),
  requestedAmount: numeric('requested_amount'),
  projectCost: numeric('project_cost'),
  category: text('category'),
  profileCompleted: boolean('profile_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const schemes = pgTable('schemes', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  titleHi: text('title_hi'),
  description: text('description').notNull(),
  descriptionHi: text('description_hi'),
  category: text('category').notNull(),
  categoryHi: text('category_hi'),
  targetGroup: text('target_group').notNull(),
  targetGroupHi: text('target_group_hi'),
  benefits: text('benefits').notNull(),
  benefitsHi: text('benefits_hi'),
  eligibility: text('eligibility').notNull(),
  eligibilityHi: text('eligibility_hi'),
  applicationProcess: text('application_process').notNull(),
  applicationProcessHi: text('application_process_hi'),
  requiredDocuments: jsonb('required_documents').$type<string[]>().default([]).notNull(),
  officialUrl: text('official_url'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  ministry: text('ministry').notNull(),
  ministryHi: text('ministry_hi'),
  schemeType: text('scheme_type').notNull(),
  occupationTags: text('occupation_tags').array().default([]).notNull(),
  stateTags: text('state_tags').array().default([]).notNull(),
  genderTags: text('gender_tags').array().default([]).notNull(),
  educationTags: text('education_tags').array().default([]).notNull(),
  ageMin: integer('age_min'),
  ageMax: integer('age_max'),
  minCost: numeric('min_cost'),
  maxCost: numeric('max_cost'),
  incomeLimit: numeric('income_limit'),
  interestRateMale: numeric('interest_rate_male'),
  interestRateFemale: numeric('interest_rate_female'),
  govtFundingPct: numeric('govt_funding_pct'),
  promoterMarginPct: numeric('promoter_margin_pct'),
  minMoratorium: integer('min_moratorium'),
  maxMoratorium: integer('max_moratorium'),
  maxTenureMonths: integer('max_tenure_months'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('schemes_occupation_tags_idx').using('gin', table.occupationTags),
  index('schemes_state_tags_idx').using('gin', table.stateTags),
  index('schemes_gender_tags_idx').using('gin', table.genderTags),
  index('schemes_education_tags_idx').using('gin', table.educationTags),
  index('schemes_start_date_idx').on(table.startDate),
  index('schemes_end_date_idx').on(table.endDate),
  index('schemes_is_active_idx').on(table.isActive),
  index('schemes_category_idx').on(table.category),
])

export const savedSchemes = pgTable('saved_schemes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  schemeId: uuid('scheme_id')
    .notNull()
    .references(() => schemes.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  unique('saved_schemes_user_id_scheme_id_key').on(table.userId, table.schemeId),
  index('saved_schemes_user_id_idx').on(table.userId),
])

export const aiSchemeSearches = pgTable('ai_scheme_searches', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.userId, { onDelete: 'cascade' }),
  userPrompt: text('user_prompt').notNull(),
  matchedSchemeIds: uuid('matched_scheme_ids').array().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('ai_scheme_searches_user_id_idx').on(table.userId),
])

export const documentChecks = pgTable('document_checks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  schemeId: uuid('scheme_id')
    .notNull()
    .references(() => schemes.id, { onDelete: 'cascade' }),
  readinessScore: integer('readiness_score'),
  status: text('status').notNull().default('pending'),
  uploadedDocuments: jsonb('uploaded_documents').$type<string[]>().default([]).notNull(),
  missingDocuments: jsonb('missing_documents').$type<string[]>().default([]).notNull(),
  aiSummary: text('ai_summary'),
  documentFeedback: jsonb('document_feedback').$type<Array<{ filename: string, status: 'valid' | 'invalid' | 'unrelated', feedback: string, confidence?: number, mappedRequirement?: string }>>().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('document_checks_user_id_idx').on(table.userId),
  index('document_checks_scheme_id_idx').on(table.schemeId),
])

export const channelPartners = pgTable('channel_partners', {
  ifsc: text('ifsc').primaryKey(),
  bank: text('bank').notNull(),
  branch: text('branch').notNull(),
  partnerType: text('partner_type').notNull(),
  nodalOfficer: text('nodal_officer'),
  contact: text('contact'),
  address: text('address'),
  district: text('district'),
  state: text('state').notNull(),
  geography: geometry('geography', { type: 'point', mode: 'xy', srid: 4326 }),
  isActive: boolean('is_active').default(true).notNull(),
}, (table) => [
  index('channel_partners_geography_idx').using('gist', table.geography),
  index('channel_partners_state_idx').on(table.state),
])

export const partnerHealthMetrics = pgTable('partner_health_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  ifsc: text('ifsc').notNull().references(() => channelPartners.ifsc, { onDelete: 'cascade' }),
  fiscalCycle: text('fiscal_cycle').notNull(),
  allocatedQuota: numeric('allocated_quota').notNull(),
  disbursedQuota: numeric('disbursed_quota').notNull(),
  npaRatio: numeric('npa_ratio').notNull(),
  isFrozen: boolean('is_frozen').default(false).notNull(),
  auditTimestamp: timestamp('audit_timestamp').defaultNow().notNull(),
}, (table) => [
  unique('partner_health_metrics_ifsc_fiscal_cycle_key').on(table.ifsc, table.fiscalCycle),
])

export const loanDossiers = pgTable('loan_dossiers', {
  id: uuid('id').primaryKey().defaultRandom(),
  trackingCode: text('tracking_code').notNull().unique(),
  applicantName: text('applicant_name').notNull(),
  phoneHash: text('phone_hash').notNull(),
  annualIncome: numeric('annual_income').notNull(),
  projectCost: numeric('project_cost').notNull(),
  calculatedEmi: numeric('calculated_emi').notNull(),
  eligibleSchemeId: uuid('eligible_scheme_id').notNull().references(() => schemes.id, { onDelete: 'restrict' }),
  allocatedPartnerIfsc: text('allocated_partner_ifsc').notNull().references(() => channelPartners.ifsc, { onDelete: 'restrict' }),
  selectedMoratorium: integer('selected_moratorium'),
  status: text('status').default('DOSSIER_GENERATED').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
