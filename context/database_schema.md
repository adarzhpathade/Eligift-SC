# CrediX — Database Schema

## 1. Purpose

This document is the database source of truth for CrediX.

The authoritative persistence layer is:

```text
Supabase
  └── PostgreSQL 15
        └── PostGIS
```

The schema supports four core data domains:

1. Government loan schemes
2. Channel-partner banking branches
3. Partner health, solvency, and quota metrics
4. Anonymous loan dossiers/applications

The database must support deterministic eligibility and deterministic geographic partner routing.

---

# 2. Database Extensions

CrediX requires:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

## Extensions

| Extension | Purpose |
|---|---|
| `uuid-ossp` | UUID primary-key generation |
| `postgis` | Geographic storage, distance calculation, and spatial filtering |

---

# 3. Entity Relationship Overview

The core relationship model is:

```text
┌──────────────────────┐
│       schemes        │
│──────────────────────│
│ id PK                │
│ scheme_code UNIQUE   │
│ scheme_name          │
│ category             │
│ financial rules      │
│ repayment rules      │
└──────────┬───────────┘
           │
           │ eligible_scheme_id
           │
           ▼
┌──────────────────────┐
│    loan_dossiers     │
│──────────────────────│
│ id PK                │
│ tracking_code UNIQUE │
│ applicant data       │
│ financial snapshot   │
│ scheme FK            │
│ partner FK           │
│ status               │
└──────────┬───────────┘
           │
           │ allocated_partner_id
           │
           ▼
┌──────────────────────┐
│   channel_partners   │
│──────────────────────│
│ id PK                │
│ ifsc_code UNIQUE     │
│ bank/branch details  │
│ geographic point     │
│ contact details      │
│ active status        │
└──────────┬───────────┘
           │
           │ partner_id
           │
           ▼
┌──────────────────────────┐
│ partner_health_metrics   │
│──────────────────────────│
│ id PK                    │
│ partner_id FK            │
│ fiscal_cycle             │
│ allocated_quota          │
│ disbursed_quota          │
│ overdue_npa_ratio        │
│ is_frozen                │
│ last_audited_at          │
└──────────────────────────┘
```

Relationship cardinality:

```text
One scheme
  → many loan dossiers

One channel partner
  → many loan dossiers

One channel partner
  → many health records across fiscal cycles

One partner/fiscal cycle
  → exactly one health record
```

---

# 4. Table: `schemes`

## Purpose

Master catalog containing the government credit scheme models used by the deterministic eligibility engine.

## Source-Defined Schema

```sql
CREATE TABLE schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_code VARCHAR(32) UNIQUE NOT NULL,
    scheme_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    min_cost NUMERIC(12, 2) NOT NULL,
    max_cost NUMERIC(12, 2) NOT NULL,
    income_limit NUMERIC(12, 2) NOT NULL DEFAULT 500000.00,
    interest_rate_male NUMERIC(4, 2) NOT NULL,
    interest_rate_female NUMERIC(4, 2) NOT NULL,
    govt_funding_pct NUMERIC(5, 2) NOT NULL DEFAULT 90.00,
    promoter_margin_pct NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    min_moratorium INT NOT NULL DEFAULT 3,
    max_moratorium INT NOT NULL DEFAULT 12,
    max_tenure_months INT NOT NULL DEFAULT 60,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Columns

| Column | Type | Null | Constraints / Purpose |
|---|---|---:|---|
| `id` | UUID | No | Primary key |
| `scheme_code` | VARCHAR(32) | No | Unique scheme identifier |
| `scheme_name` | VARCHAR(255) | No | Citizen-facing scheme name |
| `category` | VARCHAR(64) | No | Eligibility category |
| `min_cost` | NUMERIC(12,2) | No | Minimum project cost |
| `max_cost` | NUMERIC(12,2) | No | Maximum project cost |
| `income_limit` | NUMERIC(12,2) | No | Annual income ceiling |
| `interest_rate_male` | NUMERIC(4,2) | No | Male applicant interest rate |
| `interest_rate_female` | NUMERIC(4,2) | No | Female applicant interest rate |
| `govt_funding_pct` | NUMERIC(5,2) | No | Government financing percentage |
| `promoter_margin_pct` | NUMERIC(5,2) | No | Promoter contribution percentage |
| `min_moratorium` | INT | No | Minimum moratorium months |
| `max_moratorium` | INT | No | Maximum moratorium months |
| `max_tenure_months` | INT | No | Maximum total tenure |
| `is_active` | BOOLEAN | No | Whether scheme participates in eligibility |
| `created_at` | TIMESTAMPTZ | No | Creation timestamp |

## Categories Defined by Source

```text
small_business
transport
education
machinery
sanitation
```

The eligibility engine must use the database values rather than hardcoded financial policy values.

---

# 5. Seed Scheme Catalog

The source specification defines eight application models.

```sql
INSERT INTO schemes (
    scheme_code,
    scheme_name,
    category,
    min_cost,
    max_cost,
    income_limit,
    interest_rate_male,
    interest_rate_female,
    govt_funding_pct,
    promoter_margin_pct,
    min_moratorium,
    max_moratorium,
    max_tenure_months
) VALUES
(
    'MCF',
    'Micro Credit Finance',
    'small_business',
    10000,
    140000,
    500000,
    6.50,
    6.50,
    90.00,
    10.00,
    3,
    6,
    36
),
(
    'MSY',
    'Mahila Samriddhi Yojana',
    'small_business',
    10000,
    140000,
    500000,
    6.00,
    6.00,
    90.00,
    10.00,
    3,
    6,
    36
),
(
    'TLS',
    'General Term Loan Scheme',
    'machinery',
    140001,
    5000000,
    500000,
    8.00,
    7.50,
    90.00,
    10.00,
    6,
    12,
    60
),
(
    'MAY',
    'Mahila Adhikari Yojana',
    'transport',
    100000,
    1500000,
    500000,
    8.00,
    8.00,
    90.00,
    10.00,
    6,
    9,
    60
),
(
    'ELS_DOM',
    'Educational Loan (Domestic)',
    'education',
    50000,
    2000000,
    500000,
    7.50,
    7.00,
    90.00,
    10.00,
    6,
    12,
    60
),
(
    'ELS_ABR',
    'Educational Loan (Abroad)',
    'education',
    500000,
    4000000,
    500000,
    8.00,
    7.50,
    90.00,
    10.00,
    6,
    12,
    60
),
(
    'GBS',
    'Green Business Scheme',
    'small_business',
    50000,
    1500000,
    500000,
    7.00,
    6.50,
    90.00,
    10.00,
    6,
    9,
    60
),
(
    'SUY',
    'Swachhta Udyami Yojana',
    'sanitation',
    100000,
    5000000,
    500000,
    6.00,
    4.00,
    90.00,
    10.00,
    6,
    12,
    60
);
```

These values are policy/catalog data and must not be redefined in UI code.

---

# 6. Table: `channel_partners`

## Purpose

Stores participating banking/channel-partner branches that may receive routed applicants.

## Source-Defined Schema

```sql
CREATE TABLE channel_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ifsc_code VARCHAR(11) UNIQUE NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    partner_type VARCHAR(32) NOT NULL,
    nodal_officer_name VARCHAR(128) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(128),
    geom GEOGRAPHY(Point, 4326) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Columns

| Column | Type | Null | Constraints / Purpose |
|---|---|---:|---|
| `id` | UUID | No | Primary key |
| `ifsc_code` | VARCHAR(11) | No | Unique branch identifier |
| `bank_name` | VARCHAR(255) | No | Bank/channel-partner name |
| `branch_name` | VARCHAR(255) | No | Branch name |
| `partner_type` | VARCHAR(32) | No | Partner classification |
| `nodal_officer_name` | VARCHAR(128) | No | Nodal contact |
| `contact_phone` | VARCHAR(20) | No | Branch contact |
| `contact_email` | VARCHAR(128) | Yes | Optional email |
| `geom` | GEOGRAPHY(Point,4326) | No | Geographic branch location |
| `address` | TEXT | No | Branch address |
| `district` | VARCHAR(64) | No | District |
| `state` | VARCHAR(64) | No | State |
| `is_active` | BOOLEAN | No | Whether branch can participate |
| `created_at` | TIMESTAMPTZ | No | Creation timestamp |

## Partner Types Defined by Source

```text
SCA
PSB
RRB
NBFC_MFI
```

---

# 7. Spatial Index

CrediX requires a GIST spatial index for proximity searches.

```sql
CREATE INDEX idx_channel_partners_spatial
ON channel_partners
USING GIST(geom);
```

This index must remain present for the geographic routing path.

---

# 8. Geographic Coordinate Convention

The `geom` field uses:

```text
GEOGRAPHY(Point, 4326)
```

When constructing a point:

```text
longitude → X
latitude  → Y
```

Conceptually:

```sql
ST_Point(longitude, latitude)
```

Do not reverse the values.

---

# 9. Table: `partner_health_metrics`

## Purpose

Stores fiscal-cycle health, solvency, and allocation information used by the branch routing gatekeeper.

## Source-Defined Schema

```sql
CREATE TABLE partner_health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL
        REFERENCES channel_partners(id)
        ON DELETE CASCADE,
    fiscal_cycle VARCHAR(9) NOT NULL,
    allocated_quota NUMERIC(14, 2) NOT NULL,
    disbursed_quota NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    overdue_npa_ratio NUMERIC(5, 4) NOT NULL,
    is_frozen BOOLEAN NOT NULL DEFAULT FALSE,
    last_audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_partner_fiscal
        UNIQUE (partner_id, fiscal_cycle)
);
```

## Columns

| Column | Type | Null | Purpose |
|---|---|---:|---|
| `id` | UUID | No | Primary key |
| `partner_id` | UUID | No | Channel-partner foreign key |
| `fiscal_cycle` | VARCHAR(9) | No | Fiscal year identifier such as `2026-2027` |
| `allocated_quota` | NUMERIC(14,2) | No | Total allocated lending quota |
| `disbursed_quota` | NUMERIC(14,2) | No | Amount already disbursed |
| `overdue_npa_ratio` | NUMERIC(5,4) | No | Overdue NPA ratio |
| `is_frozen` | BOOLEAN | No | Policy freeze flag |
| `last_audited_at` | TIMESTAMPTZ | No | Last audit timestamp |

---

# 10. Partner/Fiscal-Cycle Uniqueness

A partner may have multiple health records over time, but only one record per fiscal cycle.

```sql
UNIQUE (partner_id, fiscal_cycle)
```

This prevents ambiguous routing data for the same partner and fiscal cycle.

---

# 11. Quota Calculation

Remaining quota is derived as:

```text
remaining_quota =
  allocated_quota - disbursed_quota
```

The source routing function uses this derived value rather than storing a separate `remaining_quota` column.

Do not add a second mutable source of truth unless there is a documented requirement.

---

# 12. Table: `loan_dossiers`

## Purpose

Stores the validated anonymous application/dossier generated after eligibility and routing.

## Source-Defined Schema

```sql
CREATE TABLE loan_dossiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code VARCHAR(24) UNIQUE NOT NULL,
    applicant_name VARCHAR(128) NOT NULL,
    phone_hash TEXT NOT NULL,
    annual_income NUMERIC(12, 2) NOT NULL,
    project_cost NUMERIC(12, 2) NOT NULL,
    eligible_scheme_id UUID NOT NULL
        REFERENCES schemes(id),
    allocated_partner_id UUID NOT NULL
        REFERENCES channel_partners(id),
    calculated_emi NUMERIC(10, 2) NOT NULL,
    selected_moratorium_months INT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DOSSIER_GENERATED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Columns

| Column | Type | Null | Purpose |
|---|---|---:|---|
| `id` | UUID | No | Internal dossier identifier |
| `tracking_code` | VARCHAR(24) | No | Citizen-safe unique reference |
| `applicant_name` | VARCHAR(128) | No | Applicant name |
| `phone_hash` | TEXT | No | Hashed phone reference |
| `annual_income` | NUMERIC(12,2) | No | Annual family income |
| `project_cost` | NUMERIC(12,2) | No | Project/loan requirement |
| `eligible_scheme_id` | UUID | No | Selected scheme |
| `allocated_partner_id` | UUID | No | Selected channel partner |
| `calculated_emi` | NUMERIC(10,2) | No | Calculated monthly EMI |
| `selected_moratorium_months` | INT | No | Citizen-selected moratorium |
| `status` | VARCHAR(32) | No | Dossier lifecycle state |
| `created_at` | TIMESTAMPTZ | No | Creation timestamp |

---

# 13. Dossier Relationships

```text
loan_dossiers.eligible_scheme_id
        ↓
schemes.id
```

and:

```text
loan_dossiers.allocated_partner_id
        ↓
channel_partners.id
```

These relationships ensure a dossier references known scheme and partner records.

---

# 14. Dossier Privacy Model

The source schema intentionally stores:

```text
phone_hash
```

rather than a raw phone number.

The application should continue this data-minimization approach.

Do not add raw:
- phone numbers
- Aadhaar numbers
- identity-document numbers
- unnecessary household information
- precise location history

to the dossier unless a future approved product requirement explicitly requires them.

---

# 15. Tracking Code

The source specifies:

```text
tracking_code VARCHAR(24)
```

Example:

```text
CRX-2026-8942
```

Requirements:
- unique
- safe to display to the citizen
- safe to print
- safe to encode into the approved QR payload
- must not contain raw personal information

The database enforces uniqueness:

```sql
UNIQUE (tracking_code)
```

---

# 16. Dossier Status

The source defines the initial status:

```text
DOSSIER_GENERATED
```

The current schema uses:

```sql
status VARCHAR(32) NOT NULL DEFAULT 'DOSSIER_GENERATED'
```

No additional lifecycle statuses should be invented in the database without a product requirement.

If additional states are required later, document their transitions before changing the schema.

---

# 17. Financial Data Types

Use PostgreSQL `NUMERIC` for persisted financial values.

Defined monetary fields include:

```text
schemes.min_cost
schemes.max_cost
schemes.income_limit
schemes.govt_funding_pct
schemes.promoter_margin_pct
partner_health_metrics.allocated_quota
partner_health_metrics.disbursed_quota
loan_dossiers.annual_income
loan_dossiers.project_cost
loan_dossiers.calculated_emi
```

Do not store citizen-facing formatted strings such as:

```text
"₹50,000"
```

in numeric database fields.

Store:

```text
50000.00
```

and format it in the presentation layer.

---

# 18. Eligibility Data Flow

The database participates in eligibility as follows:

```text
Citizen intake
      ↓
validated input
      ↓
active schemes
      ↓
deterministic eligibility engine
      ↓
primary scheme + alternatives
```

The database provides authoritative scheme policy values.

The UI must not become a second scheme-policy database.

---

# 19. Routing Data Flow

The routing path is:

```text
Citizen location
      ↓
validated latitude/longitude
      ↓
PostGIS radius filter
      ↓
channel_partners
      ↓
partner_health_metrics
      ↓
hard policy killswitch
      ↓
viability score
      ↓
ranked branches
      ↓
recommended partner
```

---

# 20. Hard Routing Killswitch

A branch must be omitted when any of these conditions is true:

```text
overdue_npa_ratio > 0.1500
OR
remaining_quota <= 0
OR
is_frozen = TRUE
```

The source routing condition is:

```sql
WHERE
    cp.is_active = TRUE
    AND phm.is_frozen = FALSE
    AND phm.overdue_npa_ratio <= 0.1500
    AND (phm.allocated_quota - phm.disbursed_quota) > 0
```

This filtering is authoritative and must not be implemented only in the browser.

---

# 21. Geographic Radius

The source routing function defaults to:

```text
radius_meters = 25000
```

Equivalent to:

```text
25 km
```

The source routing function also defaults to:

```text
max_results = 3
```

The database routing function must use PostGIS `ST_DWithin` for radius filtering.

---

# 22. Solvent Branch Function

The source specification defines the following function shape:

```sql
CREATE OR REPLACE FUNCTION get_solvent_branches(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION DEFAULT 25000,
    max_results INT DEFAULT 3
)
RETURNS TABLE (
    branch_id UUID,
    bank_name VARCHAR,
    branch_name VARCHAR,
    ifsc_code VARCHAR,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    distance_km DOUBLE PRECISION,
    nodal_officer VARCHAR,
    contact_phone VARCHAR,
    overdue_npa_ratio NUMERIC,
    remaining_quota NUMERIC,
    viability_score NUMERIC
)
```

The function should:
- accept validated user coordinates
- use PostGIS for distance calculations
- filter within the radius
- exclude frozen partners
- exclude NPA above 15%
- exclude exhausted quota
- exclude inactive partners
- calculate distance
- calculate remaining quota
- calculate viability score
- return the top configured number of results

---

# 23. Viability Score

The source defines:

```text
V_b =
  0.35 × (1 / (1 + d))
  +
  0.40 × (1 - NPA_ratio)
  +
  0.25 × min(1, Q_rem / Q_alloc)
```

where:

```text
d
= proximity distance in tens of kilometers

NPA_ratio
= overdue non-performing asset ratio

Q_rem
= remaining quota

Q_alloc
= allocated quota
```

The source SQL implements the distance term using:

```sql
ST_Distance(...) / 10000.0
```

and protects the quota division with:

```sql
NULLIF(allocated_quota, 0)
```

The implementation must preserve the source formula rather than replacing it with a different ranking algorithm.

---

# 24. Routing Output

The routing function returns:

```text
branch_id
bank_name
branch_name
ifsc_code
latitude
longitude
distance_km
nodal_officer
contact_phone
overdue_npa_ratio
remaining_quota
viability_score
```

The UI should consume this result through a typed domain model.

Do not expose unnecessary internal database columns.

---

# 25. Indexing Strategy

## Required Index

```sql
CREATE INDEX idx_channel_partners_spatial
ON channel_partners
USING GIST(geom);
```

## Unique Constraints

The source schema requires:

```text
schemes.scheme_code
channel_partners.ifsc_code
partner_health_metrics.(partner_id, fiscal_cycle)
loan_dossiers.tracking_code
```

to be unique.

## Foreign-Key Relationships

Required foreign keys:

```text
partner_health_metrics.partner_id
    → channel_partners.id

loan_dossiers.eligible_scheme_id
    → schemes.id

loan_dossiers.allocated_partner_id
    → channel_partners.id
```

---

# 26. Query Optimization

## Scheme Queries

Eligibility queries should normally retrieve only active schemes and required policy fields.

Avoid retrieving unrelated columns.

## Branch Queries

Branch routing must use:
- `ST_DWithin`
- the GIST spatial index
- authoritative health filters
- deterministic ordering

## Health Queries

Use:

```text
(partner_id, fiscal_cycle)
```

as the natural uniqueness/access pattern.

---

# 27. Migration Structure

Recommended migration sequence:

```text
supabase/migrations/
├── 001_extensions.sql
├── 002_schemes.sql
├── 003_channel_partners.sql
├── 004_partner_health_metrics.sql
├── 005_loan_dossiers.sql
└── 006_routing_functions.sql
```

## Migration 001

Enable:

```text
uuid-ossp
postgis
```

## Migration 002

Create:

```text
schemes
```

and seed scheme catalog separately.

## Migration 003

Create:

```text
channel_partners
```

and spatial index.

## Migration 004

Create:

```text
partner_health_metrics
```

## Migration 005

Create:

```text
loan_dossiers
```

## Migration 006

Create/update:

```text
get_solvent_branches
```

The exact migration filenames may be adjusted if the repository already has an established migration convention, but ordering must remain deterministic.

---

# 28. Seed Data Rules

Seed data must be reproducible.

Scheme seeds must contain the eight source-defined models:

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

Development partner seed data may be created for testing routing, but test/demo branches must not be mistaken for real production branch data.

---

# 29. Constraints and Validation

The source schema explicitly defines primary keys, required fields, unique constraints, and foreign keys.

Application-level validation should additionally verify domain values before insertion.

Examples:

```text
project_cost >= 0
annual_income >= 0
allocated_quota >= 0
disbursed_quota >= 0
selected_moratorium_months within selected scheme limits
latitude between -90 and 90
longitude between -180 and 180
```

Where a domain invariant becomes permanent and is supported by the approved schema design, it should also be represented as a database constraint.

Do not silently change source-defined schema behavior without documenting the change.

---

# 30. Delete Behavior

The source explicitly defines:

```sql
partner_health_metrics.partner_id
REFERENCES channel_partners(id)
ON DELETE CASCADE
```

Therefore, deleting a channel partner removes its health records.

The source does not explicitly define `ON DELETE` behavior for the dossier's scheme and partner foreign keys.

Do not invent destructive delete semantics for those relationships.

Production operations should prefer deactivation through:

```text
is_active = FALSE
```

for schemes and partners rather than destructive deletion.

---

# 31. Authoritative Data Rules

The following values must come from database policy data:

```text
scheme minimum cost
scheme maximum cost
income limit
interest rates
government funding percentage
promoter margin percentage
minimum moratorium
maximum moratorium
maximum tenure
partner active status
partner health
NPA ratio
quota
freeze status
```

Do not duplicate these as independent constants in the React UI.

The frontend may use cached/read-only values for presentation, but the authoritative decision must use validated backend/database data.

---

# 32. Security Rules

Database operations must be protected according to the production Supabase security model.

At minimum:
- do not expose unrestricted write access to public citizens
- do not allow arbitrary scheme policy modification from the public client
- do not allow citizens to manipulate partner health data
- do not allow clients to bypass routing killswitches
- validate dossier creation server-side
- minimize stored PII

Administrative data-management permissions should be separated from public citizen operations.

---

# 33. RLS / Authorization Boundary

The public CrediX citizen flow should not receive unrestricted table-level mutation permissions.

Preferred architecture:

```text
Citizen UI
    ↓
safe application boundary / RPC
    ↓
validated database operation
    ↓
PostgreSQL
```

Sensitive policy tables should be protected from arbitrary browser writes.

The exact RLS policy definitions should be implemented with the deployment's authenticated/admin model and must not grant broader permissions than the workflow requires.

---

# 34. Financial Calculation Persistence

The dossier stores:

```text
calculated_emi
selected_moratorium_months
project_cost
annual_income
```

The persisted values represent the validated result at dossier creation.

The calculation engine remains the source of the calculation algorithm.

Do not recalculate the stored EMI using a different formula when displaying the same dossier unless explicitly performing a new scenario calculation.

---

# 35. Schema Non-Violation Rules

AI coding agents must never:

- rename source-defined tables without an approved migration
- rename source-defined columns for style reasons
- replace numeric financial columns with formatted strings
- remove the PostGIS geography type
- remove the spatial GIST index
- remove unique IFSC enforcement
- remove partner/fiscal-cycle uniqueness
- bypass the NPA killswitch
- bypass quota exhaustion filtering
- bypass frozen-partner filtering
- store raw phone numbers when the workflow requires `phone_hash`
- store eligibility policy only in frontend constants
- manually edit production schema outside migrations
- delete source seed schemes
- introduce an alternate source of truth for remaining quota
- use an LLM to decide database eligibility or routing

---

# 36. Database Definition of Done

The database foundation is complete when:

```text
[ ] uuid-ossp is enabled
[ ] postgis is enabled
[ ] schemes table exists
[ ] all 8 scheme records are seeded
[ ] channel_partners table exists
[ ] channel partner spatial GIST index exists
[ ] partner_health_metrics table exists
[ ] partner/fiscal-cycle uniqueness exists
[ ] loan_dossiers table exists
[ ] tracking_code uniqueness exists
[ ] all required foreign keys exist
[ ] migrations run from a clean database
[ ] seeds run reproducibly
[ ] routing function exists
[ ] ST_DWithin is used for radius filtering
[ ] NPA > 15% is excluded
[ ] zero remaining quota is excluded
[ ] frozen partners are excluded
[ ] inactive partners are excluded
[ ] viability scoring matches the source formula
[ ] public access cannot mutate protected policy data
```

---

# 37. Database Source-of-Truth Principle

CrediX has three distinct sources of truth:

```text
Product behavior
→ project_overview.md / build_plan.md

Visual behavior
→ ui_tokens.md / ui_rules.md / ui_registry.md

Persisted policy and operational data
→ PostgreSQL schema and migrations
```

When implementing eligibility or routing, database policy values must remain authoritative.

The database should store facts and policy configuration; the application domain layer should implement the deterministic algorithms that operate on those values.
