# CrediX — AI Coding Agent Operating Manual

> [!WARNING]
> **PROJECT MIGRATION NOTICE**
> The UI, backend, and entire implementation of CrediX have been migrated to the `Eligify` repository to accelerate development. This folder now serves purely as a documentation hub for CrediX domain knowledge. Do not look for source code here.
> 
> The new codebase is located at: `e:\Projects\Hackathon Projects\Eligify`

## 1. Project Mission

CrediX is a zero-friction, multilingual Progressive Web App that helps Scheduled Caste beneficiaries identify suitable concessional government credit schemes and reach an appropriate participating channel partner.

The product must make a complicated financing discovery workflow feel simple:

```text
Purpose
   ↓
Amount
   ↓
Income
   ↓
Details
   ↓
Eligibility
   ↓
Repayment
   ↓
Nearby viable partner
   ↓
Routing slip
```

CrediX is not a generic banking dashboard.

The experience should remain:
- citizen-first
- low-friction
- multilingual
- mobile-first
- deterministic
- visually warm
- operationally practical

---

# 2. Product Goals

The primary product goals are:

1. Reduce friction in government-credit discovery.
2. Make scheme eligibility understandable.
3. Prevent incorrect or hallucinated financial recommendations.
4. Provide transparent repayment estimates.
5. Route applicants toward viable participating partners.
6. Produce a useful next-step artifact through the routing slip.
7. Support English and Hindi.
8. Work well as a PWA on mobile devices.
9. Preserve privacy through data minimization.
10. Make the system straightforward for AI coding agents to implement and maintain.

---

# 3. Tech Stack Summary

## Frontend

```text
React
Vite
TypeScript
Tailwind CSS
PWA/service worker
i18next
react-i18next
```

## Backend / Data

```text
Supabase
PostgreSQL 15
PostGIS
```

## Integrations

```text
Bhashini Speech-to-Text
Google Maps navigation intent
PDF generation
QR generation
```

## Core Engineering Principle

The eligibility engine, repayment engine, and routing gatekeeper are deterministic.

LLMs must never make authoritative:
- eligibility decisions
- financial-policy decisions
- EMI calculations
- partner viability decisions
- NPA decisions
- quota decisions

---

# 4. Architecture Summary

The preferred dependency direction is:

```text
React Page
   ↓
Feature Component
   ↓
Feature Hook / Action
   ↓
Domain Service
   ↓
Application Boundary
   ↓
Supabase / RPC / Provider Adapter
   ↓
PostgreSQL / External Provider
```

Do not reverse this dependency direction.

## Major Feature Boundaries

```text
src/features/
├── eligibility/
├── repayment/
├── routing/
├── dossier/
├── localization/
└── voice/
```

## Database

Core tables:

```text
schemes
channel_partners
partner_health_metrics
loan_dossiers
```

Geospatial routing uses:

```text
PostGIS
ST_DWithin
GIST spatial index
get_solvent_branches(...)
```

---

# 5. Coding Standards Summary

## TypeScript

Use strict TypeScript.

Prefer:

```ts
type IntakePurpose =
  | "small_business"
  | "machinery"
  | "education"
  | "transport"
  | "sanitation";
```

Avoid:

```ts
const value: any = response;
```

Do not use `any` unless there is a documented unavoidable external-library boundary.

---

## Components

Components should:
- have one clear responsibility
- remain reusable
- avoid business calculations
- avoid direct database access
- use semantic UI tokens
- support accessibility
- support responsive layouts

---

## Business Logic

Business logic belongs in domain/feature services.

Bad:

```tsx
function AmountCard() {
  const emi = projectCost * 0.9 * 0.006;
  return <div>{emi}</div>;
}
```

Preferred:

```tsx
const repayment = calculateRepayment(input);
return <EMIHighlight monthlyEmi={repayment.monthlyEmi} />;
```

---

## API Routes

API routes should remain thin:

```text
validate
  ↓
call domain service
  ↓
call data/provider boundary
  ↓
return typed response
```

Do not place large business algorithms directly inside route handlers.

---

## Database

Use migrations.

Never manually modify production schema.

Use numeric types for financial values.

Use UUIDs for internal primary keys.

Preserve:
- unique constraints
- foreign keys
- spatial index
- routing killswitch
- fiscal-cycle uniqueness

---

# 6. Design System Summary

The CrediX visual language is based on the supplied UI references.

## Application Background

```text
#fbf7ef
```

## Purpose

```text
Surface: #e8ebff
Border/Foreground: #899bff
```

## Amount

```text
Surface: #caeb65
Border/Foreground: #316045
```

## Income

```text
Surface: #f5b2bd
Border/Foreground: #642731
```

## Details

```text
Surface: #ebe3d4
Border: #c3b591
Foreground: #5f594d
```

The four semantic card identities must remain stable.

Do not introduce arbitrary card colors.

---

# 7. Database Summary

## `schemes`

Contains authoritative scheme policy:

```text
scheme_code
scheme_name
category
min_cost
max_cost
income_limit
interest_rate_male
interest_rate_female
govt_funding_pct
promoter_margin_pct
min_moratorium
max_moratorium
max_tenure_months
is_active
```

The source scheme catalog contains:

```text
MCF
MSY
TLS
MAY
ELS_DOM
ELS_ABR
GBS
SUY
```

---

## `channel_partners`

Contains:

```text
IFSC
bank
branch
partner type
nodal officer
contact
geography
address
district
state
active state
```

The geography column is:

```text
GEOGRAPHY(Point, 4326)
```

---

## `partner_health_metrics`

Contains:

```text
fiscal cycle
allocated quota
disbursed quota
NPA ratio
freeze status
audit timestamp
```

One partner may have one health record per fiscal cycle.

---

## `loan_dossiers`

Contains:

```text
tracking code
applicant name
phone hash
annual income
project cost
eligible scheme
allocated partner
calculated EMI
selected moratorium
status
created timestamp
```

The initial status is:

```text
DOSSIER_GENERATED
```

---

# 8. Routing Gatekeeper

The routing system must exclude a partner when:

```text
overdue_npa_ratio > 0.1500
OR
remaining_quota <= 0
OR
is_frozen = TRUE
```

It must also exclude inactive partners.

The default routing radius is:

```text
25 km
```

The default result count is:

```text
3
```

Use:

```text
ST_DWithin
```

for geographic filtering.

Do not download all branches to the browser and filter them client-side.

---

# 9. Routing Score

Use the source-defined viability score:

```text
V_b =
  0.35 × (1 / (1 + d))
  +
  0.40 × (1 - NPA_ratio)
  +
  0.25 × min(1, Q_rem / Q_alloc)
```

The routing implementation must preserve this formula.

Do not replace it with:
- nearest-only ranking
- arbitrary weighted scoring
- AI ranking
- popularity ranking

---

# 10. API Summary

Important application contracts include:

```text
GET  /api/schemes
POST /api/eligibility/evaluate
POST /api/repayment/calculate
POST /api/routing/branches
POST /api/dossiers
POST /api/dossiers/{trackingCode}/routing-slip
GET  /api/health
```

The Bhashini integration remains behind a provider adapter.

Google Maps is used through a validated directions intent URL.

---

# 11. Required Reading Order

Before coding, read these files in order:

1. `project_overview.md`
2. `architecture.md`
3. `build_plan.md`
4. `code_standards.md`
5. `ui_tokens.md`
6. `ui_rules.md`
7. `database_schema.md`
8. `api_contracts.md`
9. `progress_tracker.md`

Then inspect the existing repository.

If any repository implementation conflicts with the documentation, stop and identify the conflict before making a broad change.

---

# 12. Agent Workflow

## Before Coding

The agent must:

1. Read the required documentation.
2. Read the active feature in `progress_tracker.md`.
3. Read the corresponding feature in `build_plan.md`.
4. Inspect existing implementation.
5. Verify dependencies.
6. Identify reusable components.
7. Identify required migrations/API contracts.
8. Define the smallest implementation path.
9. Avoid unrelated changes.

---

# 13. Active Feature Rule

At any point there should be one primary active feature.

Example:

```text
Active Feature:
CRX-08 — Scheme Eligibility Engine
```

The agent may modify dependency files when necessary, but the implementation goal must remain the active feature.

Do not begin multiple unrelated feature tracks in the same session unless explicitly instructed.

---

# 14. Implementation Workflow

For each feature:

```text
Read feature
   ↓
Inspect repository
   ↓
Inspect existing abstractions
   ↓
Plan minimal changes
   ↓
Implement
   ↓
Run tests
   ↓
Run type check
   ↓
Run lint
   ↓
Run production build
   ↓
Verify acceptance criteria
   ↓
Update progress_tracker.md
```

---

# 15. Reuse Before Creation

Before creating a component, utility, hook, or service:

```text
Search existing code.
Search ui_registry.md.
Search feature directories.
Search lib/.
```

If a suitable abstraction exists:
- reuse it
- extend it carefully
- update the registry if its responsibility changes

Do not duplicate functionality.

---

# 16. UI Implementation Rules

Use semantic classes.

Preferred:

```tsx
<div className="bg-amount-surface text-amount-foreground border-amount-border">
```

Avoid:

```tsx
<div className="bg-[#caeb65] text-[#316045] border-[#316045]">
```

Raw values belong to the token layer.

---

# 17. Localization Rules

Every citizen-facing string must be localized.

Use:

```tsx
const { t } = useTranslation();

return <h1>{t("intake.amount.title")}</h1>;
```

Do not hardcode English text into components.

Required languages:

```text
English
Hindi
```

Test Hindi for:
- wrapping
- line height
- button width
- card height
- PDF layout

---

# 18. Financial Rules

Use numeric values internally.

Use Indian currency formatting for display:

```text
₹50,000
₹1,50,000
₹5,00,000
```

Never hardcode policy values such as:

```ts
const MAX_INCOME = 500000;
const INTEREST_RATE = 6.5;
```

when the value belongs to scheme policy.

Read authoritative values from scheme data.

---

# 19. Eligibility Rules

Eligibility must be deterministic.

The engine may use:
- category
- project cost
- annual income
- SC declaration
- applicant attributes required by the scheme

The engine must return:
- matched/not matched
- primary scheme
- alternatives
- deterministic reason codes

Do not use an LLM to determine whether an applicant qualifies.

---

# 20. Repayment Rules

The source repayment model is:

```text
P = 0.90 × Project Cost

M = 0.10 × Project Cost

r = Annual Rate / (12 × 100)

n = T - m
```

Moratorium phase:

```text
Principal repayment = 0
Monthly servicing interest = P × r
```

Amortization phase:

```text
EMI =
P × r × (1 + r)^n
-------------------
(1 + r)^n - 1
```

Use scheme-provided:
- interest rate
- funding percentage
- promoter margin
- moratorium bounds
- tenure

Do not implement a different financial formula without an approved requirement.

---

# 21. Dossier Rules

Dossiers are created only after:
- eligibility is validated
- repayment data is validated
- partner is validated
- routing constraints are rechecked

The server must not trust a client-supplied claim that a scheme or branch is valid.

Use:

```text
phone_hash
```

instead of a raw phone number where the schema requires it.

Generate a unique:

```text
tracking_code
```

The tracking code must not contain raw personal information.

---

# 22. Routing Slip Rules

The routing slip should be:
- concise
- printable
- one page where practical
- bilingual when required
- based on validated dossier data
- privacy-conscious

The QR payload must not contain unnecessary PII.

---

# 23. Offline Rules

The application shell and local intake draft may work offline.

The agent must never make offline UI imply that:
- a dossier was saved
- branch health is current
- quota is current
- NPA status is current
- a server-side operation succeeded

Dynamic server state requires authoritative confirmation.

---

# 24. Security Rules

Never commit:
- API keys
- service-role keys
- provider secrets
- passwords
- private credentials

Never expose Supabase service-role credentials in browser code.

Never trust browser-supplied:
- eligibility
- scheme policy
- branch viability
- NPA
- quota
- freeze status
- calculated EMI

Validate at the authoritative boundary.

---

# 25. Error Handling

Errors should be typed and safe.

Preferred:

```ts
type AppError = {
  code: string;
  message: string;
  cause?: unknown;
};
```

Do not show:

```text
Postgres error: duplicate key value violates constraint...
```

to citizens.

Instead map it to a safe user-facing message.

Log technical details only where appropriate and without unnecessary PII.

---

# 26. Logging

Useful operational fields:

```text
request_id
route
duration_ms
status_code
error_code
provider_latency_ms
```

Avoid logging:
- raw phone numbers
- identity numbers
- complete intake payloads
- secrets
- provider credentials

---

# 27. Performance Rules

Prioritize:

```text
small bundle
fast first render
minimal network requests
deterministic eligibility
indexed spatial queries
lazy provider integrations
stable reusable components
```

Eligibility has a source target of:

```text
<10ms
```

The eligibility implementation must remain lightweight enough to preserve this target.

---

# 28. Testing Rules

At minimum, every feature should include appropriate:

```text
unit tests
integration tests
component tests
end-to-end tests
```

Use the smallest relevant test level.

Do not create end-to-end tests for logic that is better verified with deterministic unit tests.

Critical domains requiring strong test coverage:

```text
eligibility
repayment
routing
dossier validation
```

---

# 29. Database Migration Rules

All schema changes must use migrations.

Never:
- manually edit production tables
- delete a migration to hide a mistake
- rewrite old migrations after they have been applied in a shared environment

For a changed schema:
1. create a new migration
2. update database documentation
3. update affected domain types
4. update API contracts
5. update tests

---

# 30. File Modification Rules

Agents may modify files required by the active feature and its direct dependencies.

Agents must:
- reuse components
- reuse abstractions
- preserve naming conventions
- preserve architecture boundaries
- update documentation when contracts change
- keep diffs focused

Before modifying a shared abstraction, verify all known usages.

---

# 31. Forbidden Actions

Agents must never:

- rewrite stable systems unnecessarily
- replace the stack without explicit approval
- mix business logic into presentation components
- put database queries in reusable UI components
- bypass the deterministic eligibility engine
- use an LLM for eligibility
- use an LLM for financial calculations
- bypass the routing killswitch
- expose raw provider secrets
- introduce arbitrary UI colors
- create duplicate design-system primitives
- ignore localization
- ignore mobile behavior
- remove accessibility support
- silently alter policy values
- modify unrelated features
- delete working functionality merely to simplify implementation
- mark unverified work as complete

---

# 32. When Documentation and Code Disagree

Use this escalation order:

```text
1. Identify the conflict.
2. Determine which source is authoritative.
3. Do not silently overwrite either source.
4. Make the smallest safe correction.
5. Update documentation if the approved behavior has changed.
6. Verify dependent contracts.
```

Never "fix" a documented requirement simply because a different implementation seems easier.

---

# 33. Definition of Done

A feature is complete only when:

```text
[ ] Acceptance criteria pass
[ ] Verification steps pass
[ ] Relevant tests pass
[ ] Type checks pass
[ ] Lint passes
[ ] Production build succeeds
[ ] Responsive behavior is verified
[ ] Accessibility is verified
[ ] English is verified
[ ] Hindi is verified where applicable
[ ] No secrets are exposed
[ ] No unrelated regressions are introduced
[ ] Documentation is synchronized
[ ] progress_tracker.md is updated
```

---

# 34. Session Completion Protocol

At the end of every coding session:

1. Summarize completed implementation internally.
2. Run the relevant verification commands.
3. Record blockers.
4. Update `progress_tracker.md`.
5. Leave the repository in a buildable state whenever possible.

If the feature is incomplete, leave:

```text
Active Feature:
CRX-XX — Feature Name

Status:
In Progress

Blocker:
<specific blocker or None>
```

Do not falsely mark completion.

---

# 35. Final Agent Principle

CrediX should be implemented as a coherent product, not as a collection of disconnected screens.

Every implementation decision should preserve:

```text
Simple citizen experience
        +
Deterministic financial logic
        +
Authoritative policy data
        +
Safe geographic routing
        +
Consistent visual language
        +
AI-agent maintainability
```

When uncertain, prefer the smallest implementation that:
- follows the documented architecture
- reuses existing abstractions
- preserves deterministic behavior
- maintains the CrediX visual system
- keeps the user workflow simple
- can be independently tested
- does not introduce unnecessary infrastructure
