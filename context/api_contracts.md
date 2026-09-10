# CrediX — API Contracts

## 1. Purpose

This document defines the application-facing contracts between the CrediX PWA, its deterministic domain services, Supabase/PostgreSQL/PostGIS, and external provider boundaries.

The source specification explicitly defines the PostGIS RPC function `get_solvent_branches(...)`, the database schema, the four-step intake payload, the Bhashini speech-to-text integration, and the Google Maps intent URL.

Where the source specification does not prescribe a REST route name, this document defines a thin implementation contract so AI coding agents have a stable interface to build against.

The critical rule is:

> API boundaries transport validated data. They do not contain business-policy logic that belongs in domain services or PostgreSQL.

---

# 2. API Architecture

```text
React PWA
   │
   ├── local deterministic eligibility
   │
   ├── repayment calculation
   │
   └── application boundary
          │
          ├── scheme data
          ├── dossier creation
          └── branch routing RPC
                 │
                 ▼
        Supabase / PostgreSQL / PostGIS
```

External provider boundaries:

```text
CrediX
  ├── Bhashini → speech-to-text
  └── Google Maps → navigation intent
```

The eligibility engine and EMI engine must remain deterministic.

No LLM is permitted to make:
- eligibility decisions
- scheme selection
- interest-rate decisions
- EMI calculations
- partner viability decisions
- NPA killswitch decisions
- quota decisions

---

# 3. API Conventions

## 3.1 Content Type

JSON request/response endpoints use:

```http
Content-Type: application/json
```

except binary/file upload or provider-specific requests.

---

## 3.2 Success Envelope

Application endpoints should prefer:

```json
{
  "data": {},
  "error": null
}
```

for structured responses.

For simple operations where an envelope adds no value, a documented resource response is acceptable.

---

## 3.3 Error Envelope

All application errors use:

```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the information you entered.",
    "fields": {}
  }
}
```

Rules:
- `code` is stable and machine-readable.
- `message` is safe for presentation after localization mapping.
- internal database/provider error details are never returned to citizens.
- field-level validation errors belong under `fields`.

---

# 4. Authentication Model

CrediX uses a zero-auth citizen lifecycle.

The core citizen flow must not require:
- email
- password
- OTP
- login account

The four-card intake can be completed without authentication.

The backend must therefore treat public intake endpoints as controlled anonymous operations.

Do not expose unrestricted database write access merely because the citizen is unauthenticated.

---

# 5. Domain Type: Intake Request

The four-card intake produces the following conceptual payload.

```ts
type IntakeRequest = {
  category:
    | "small_business"
    | "machinery"
    | "education"
    | "transport"
    | "sanitation";

  project_cost: number;

  annual_income: number;

  applicant_name: string;

  gender: "Male" | "Female";

  is_sc: boolean;
};
```

The source specification defines these output keys:

```text
category
project_cost
annual_income
applicant_name
gender
is_sc
```

The client may persist an incomplete draft locally, but only a validated complete intake may be submitted as a dossier.

---

# 6. Endpoint: Get Active Schemes

## Route

```http
GET /api/schemes
```

## Purpose

Returns the active scheme catalog required by the client and deterministic eligibility layer.

## Authentication

```text
None
```

## Request

No request body.

Optional query parameters are not required for the initial implementation.

## Response

```json
{
  "data": {
    "schemes": [
      {
        "id": "uuid",
        "scheme_code": "MCF",
        "scheme_name": "Micro Credit Finance",
        "category": "small_business",
        "min_cost": 10000,
        "max_cost": 140000,
        "income_limit": 500000,
        "interest_rate_male": 6.5,
        "interest_rate_female": 6.5,
        "govt_funding_pct": 90,
        "promoter_margin_pct": 10,
        "min_moratorium": 3,
        "max_moratorium": 6,
        "max_tenure_months": 36
      }
    ]
  },
  "error": null
}
```

## Validation

Only:

```text
is_active = TRUE
```

schemes are eligible for the active catalog.

## Error Responses

```text
503 SCHEME_CATALOG_UNAVAILABLE
```

The client must not silently substitute invented policy values when the authoritative catalog is unavailable.

---

# 7. Endpoint: Evaluate Eligibility

## Route

```http
POST /api/eligibility/evaluate
```

## Purpose

Evaluates the four-card intake against the active scheme catalog and returns:
- one primary match
- secondary eligible alternatives
- deterministic eligibility reasons

This route is an application-level contract defined for implementation. The source specification requires the deterministic decision engine but does not prescribe a specific HTTP route.

## Authentication

```text
None
```

## Request

```json
{
  "category": "small_business",
  "project_cost": 50000,
  "annual_income": 30000,
  "applicant_name": "Applicant",
  "gender": "Male",
  "is_sc": true
}
```

## Validation Rules

```text
category must be one of the supported categories
project_cost must be finite and > 0
annual_income must be finite and >= 0
applicant_name must be non-empty
gender must be Male or Female
is_sc must be true for the intended beneficiary workflow
```

Financial values must remain numeric.

Reject:
- `NaN`
- `Infinity`
- negative project cost
- negative income
- unknown category
- invalid gender

## Response

```json
{
  "data": {
    "primary": {
      "scheme": {
        "id": "uuid",
        "scheme_code": "MSY",
        "scheme_name": "Mahila Samriddhi Yojana",
        "category": "small_business",
        "min_cost": 10000,
        "max_cost": 140000,
        "income_limit": 500000,
        "interest_rate_male": 6,
        "interest_rate_female": 6,
        "govt_funding_pct": 90,
        "promoter_margin_pct": 10,
        "min_moratorium": 3,
        "max_moratorium": 6,
        "max_tenure_months": 36
      },
      "reasons": [
        {
          "code": "CATEGORY_MATCH",
          "message_key": "eligibility.reasons.categoryMatch"
        }
      ]
    },
    "alternatives": [],
    "matched": true
  },
  "error": null
}
```

## No-Match Response

```json
{
  "data": {
    "primary": null,
    "alternatives": [],
    "matched": false,
    "reasons": [
      {
        "code": "INCOME_LIMIT_EXCEEDED",
        "message_key": "eligibility.reasons.incomeLimitExceeded"
      }
    ]
  },
  "error": null
}
```

## Decision Rules

The API must delegate to the deterministic eligibility engine.

It must not:
- call an LLM
- use natural-language interpretation to decide eligibility
- invent policy thresholds
- select a scheme based on subjective ranking

The source specification requires:
- sub-10ms deterministic evaluation target
- zero LLM hallucination
- one primary scheme
- secondary alternatives

---

# 8. Endpoint: Calculate Repayment

## Route

```http
POST /api/repayment/calculate
```

## Purpose

Calculates the moratorium-aware repayment schedule for a selected eligible scheme.

This is an application-level route contract. The source specification defines the mathematical model but does not prescribe a REST route.

## Authentication

```text
None
```

## Request

```json
{
  "project_cost": 50000,
  "annual_interest_rate": 6.5,
  "government_funding_pct": 90,
  "promoter_margin_pct": 10,
  "moratorium_months": 3,
  "total_tenure_months": 36
}
```

## Validation Rules

```text
project_cost > 0
annual_interest_rate >= 0
government_funding_pct >= 0
promoter_margin_pct >= 0
moratorium_months >= scheme.min_moratorium
moratorium_months <= scheme.max_moratorium
total_tenure_months > moratorium_months
```

The selected scheme's actual limits are authoritative.

## Calculation Contract

The source model defines:

```text
P = 0.90 × Project Cost

M = 0.10 × Project Cost

r = Annual Rate / (12 × 100)

n = T - m
```

Phase 1:

```text
Principal repayment = ₹0.00
Monthly servicing interest = P × r
```

Phase 2:

```text
EMI =
P × r × (1 + r)^n
-------------------
(1 + r)^n - 1
```

## Response

```json
{
  "data": {
    "project_cost": 50000,
    "principal_financed": 45000,
    "promoter_contribution": 5000,
    "annual_interest_rate": 6.5,
    "monthly_interest_rate": 0.0054166667,
    "moratorium_months": 3,
    "total_tenure_months": 36,
    "active_amortization_months": 33,
    "moratorium_monthly_interest": 243.75,
    "active_monthly_emi": 1547.12,
    "schedule": [
      {
        "month": 1,
        "phase": "moratorium",
        "principal_repayment": 0,
        "interest": 243.75
      }
    ]
  },
  "error": null
}
```

The exact calculated numeric output must be generated by the implementation from the formula, not copied from this example.

---

# 9. Endpoint: Get Solvent Branches

## Route

```http
POST /api/routing/branches
```

## Purpose

Returns nearby viable channel partners using the authoritative PostGIS routing function.

The source specification explicitly defines the database function:

```text
get_solvent_branches(
  user_lat,
  user_lng,
  radius_meters,
  max_results
)
```

## Authentication

```text
None
```

## Request

```json
{
  "user_lat": 28.6139,
  "user_lng": 77.209,
  "radius_meters": 25000,
  "max_results": 3
}
```

## Defaults

```text
radius_meters = 25000
max_results = 3
```

## Validation

```text
latitude >= -90
latitude <= 90

longitude >= -180
longitude <= 180

radius_meters > 0
max_results >= 1
```

Do not accept arbitrary SQL or filter expressions from the client.

## Database Operation

The route invokes:

```sql
SELECT *
FROM get_solvent_branches(
    user_lat,
    user_lng,
    radius_meters,
    max_results
);
```

## Response

```json
{
  "data": {
    "branches": [
      {
        "branch_id": "uuid",
        "bank_name": "Example Bank",
        "branch_name": "Main Branch",
        "ifsc_code": "EXMP0001234",
        "latitude": 28.612,
        "longitude": 77.21,
        "distance_km": 0.31,
        "nodal_officer": "Nodal Officer",
        "contact_phone": "0000000000",
        "overdue_npa_ratio": 0.065,
        "remaining_quota": 2500000,
        "viability_score": 0.931
      }
    ]
  },
  "error": null
}
```

## Hard Killswitch

The database function must exclude a partner when:

```text
overdue_npa_ratio > 0.1500
OR
remaining_quota <= 0
OR
is_frozen = TRUE
```

It must also exclude inactive partners.

The browser must never bypass these conditions.

---

# 10. Routing Scoring Contract

The source defines:

```text
V_b =
  0.35 × (1 / (1 + d))
  +
  0.40 × (1 - NPA_ratio)
  +
  0.25 × min(1, Q_rem / Q_alloc)
```

where distance is expressed in tens of kilometers.

The source SQL calculates the distance component using:

```sql
ST_Distance(...) / 10000.0
```

The API must return the database-generated:

```text
viability_score
```

rather than independently recalculating it in React.

---

# 11. Endpoint: Create Loan Dossier

## Route

```http
POST /api/dossiers
```

## Purpose

Creates the anonymous `loan_dossiers` record after the citizen has a validated scheme, repayment result, and selected/routed partner.

This route is an application-level contract defined for implementation. The source specification requires the server to commit an anonymous dossier but does not prescribe a REST route.

## Authentication

```text
None
```

## Request

```json
{
  "applicant_name": "Applicant",
  "phone_hash": "hashed-value",
  "annual_income": 30000,
  "project_cost": 50000,
  "eligible_scheme_id": "uuid",
  "allocated_partner_id": "uuid",
  "calculated_emi": 1547.12,
  "selected_moratorium_months": 3
}
```

## Validation

Required:
- applicant name
- phone hash
- annual income
- project cost
- valid scheme ID
- valid partner ID
- calculated EMI
- moratorium months

The server must verify:
1. scheme exists and is active
2. partner exists and is active
3. partner is currently routable
4. moratorium is inside the scheme's limits
5. financial values are valid
6. the dossier is internally consistent

The client must not be trusted to assert eligibility merely by sending a scheme ID.

## Server Behavior

The server:
1. validates request
2. validates scheme
3. validates partner
4. validates repayment inputs
5. generates a unique tracking code
6. inserts `loan_dossiers`
7. returns the created tracking reference

## Response

```json
{
  "data": {
    "id": "uuid",
    "tracking_code": "CRX-2026-8942",
    "status": "DOSSIER_GENERATED",
    "created_at": "2026-09-09T00:00:00Z"
  },
  "error": null
}
```

The example tracking code is illustrative only. Implementations must generate unique values.

---

# 12. Endpoint: Generate Routing Slip

## Route

```http
POST /api/dossiers/{trackingCode}/routing-slip
```

## Purpose

Generates the pre-vetted one-page routing slip PDF for the dossier.

## Authentication

```text
None
```

The endpoint must still validate the tracking code and only expose the minimum information necessary for the routing slip.

## Request

No body required.

## Response

The endpoint may return a PDF directly:

```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="credix-routing-slip.pdf"
```

or return a generated artifact reference if the chosen PDF architecture requires it.

## PDF Requirements

The routing slip contains:
- tracking code
- selected scheme
- key financial summary
- routed branch
- branch contact information
- navigation information where required
- QR code using the approved anonymous tracking reference

Do not encode unnecessary PII in the QR code.

---

# 13. Google Maps Navigation Contract

Google Maps is not treated as a CrediX backend API.

The client constructs an intent URL:

```text
https://www.google.com/maps/dir/?api=1&destination=LAT,LNG
```

Example:

```text
https://www.google.com/maps/dir/?api=1&destination=28.612,77.21
```

The application should generate the URL from validated branch coordinates.

Rules:
- latitude and longitude must come from the routed branch record
- do not accept arbitrary destination URLs from users
- encode destination values safely
- open through a normal user action

Primary CTA:

```text
Open in Google Maps
```

---

# 14. Bhashini Speech-to-Text Contract

## Provider

```text
Bhashini Speech-to-Text Regional API
```

The source specifies Bhashini as an on-demand voice-to-text integration for populating form fields.

## Client Contract

```ts
type VoiceTranscriptionResult = {
  text: string;
  language: "en" | "hi";
};
```

## Trigger

Voice recognition is explicitly user initiated through the microphone control.

Do not continuously listen.

## Request Boundary

The exact Bhashini provider request/response schema must be isolated inside:

```text
src/features/voice/
```

or its provider adapter.

Provider-specific payloads must not leak into general form components.

## Success

Return only normalized transcription text to the form.

## Failure

Return a safe typed error such as:

```json
{
  "code": "VOICE_TRANSCRIPTION_FAILED",
  "message": "Voice input could not be processed."
}
```

The form must remain usable without voice input.

---

# 15. Endpoint: Health Check

## Route

```http
GET /api/health
```

## Purpose

Operational health check for deployment monitoring.

## Authentication

```text
None
```

## Response

```json
{
  "data": {
    "status": "ok"
  },
  "error": null
}
```

The endpoint must not expose:
- database credentials
- environment variables
- provider secrets
- internal SQL
- infrastructure topology

---

# 16. Error Codes

Use stable codes.

## Validation

```text
VALIDATION_ERROR
INVALID_CATEGORY
INVALID_PROJECT_COST
INVALID_ANNUAL_INCOME
INVALID_APPLICANT_DETAILS
INVALID_COORDINATES
INVALID_MORATORIUM
INVALID_TENURE
```

## Eligibility

```text
SCHEME_CATALOG_UNAVAILABLE
ELIGIBILITY_EVALUATION_FAILED
NO_ELIGIBLE_SCHEME
```

## Routing

```text
ROUTING_UNAVAILABLE
NO_SOLVENT_BRANCH
INVALID_LOCATION
```

## Dossier

```text
DOSSIER_CREATION_FAILED
INVALID_SCHEME
INVALID_PARTNER
DOSSIER_NOT_FOUND
TRACKING_CODE_GENERATION_FAILED
```

## Provider

```text
VOICE_TRANSCRIPTION_FAILED
PDF_GENERATION_FAILED
```

---

# 17. HTTP Status Mapping

Use conventional status codes.

| Status | Meaning |
|---|---|
| `200` | Successful read/calculation |
| `201` | Dossier created |
| `400` | Invalid request |
| `404` | Resource not found |
| `409` | Conflict, such as tracking-code collision |
| `422` | Valid structure but invalid domain values |
| `429` | Rate limited |
| `500` | Unexpected server failure |
| `503` | Dependency unavailable |

Do not use `200` for an operation that failed simply because an error JSON was returned.

---

# 18. Rate Limiting

Because citizen endpoints are public, rate limiting must be applied at the deployment/application boundary where appropriate.

At minimum, protect:
- dossier creation
- routing requests
- voice-provider proxy requests

The rate limiter must not prevent normal four-step usage.

Do not rely on a hidden client-side throttle as the only abuse control.

---

# 19. API Security Rules

Never accept these from the client as authoritative:

```text
scheme eligibility
interest rate
government funding percentage
promoter margin
NPA status
quota status
partner freeze status
viability score
```

These are authoritative server/database outputs.

The client can request a calculation, but cannot dictate the result.

---

# 20. API and Database Boundary

The preferred relationship is:

```text
API route
   ↓
validation
   ↓
domain service
   ↓
Supabase client / RPC
   ↓
PostgreSQL
```

Do not put raw SQL into React components.

Do not put UI decisions into PostgreSQL.

Do not make the database responsible for localization.

---

# 21. Client Caching Rules

Safe-to-cache/read data:

```text
active scheme catalog
localization files
static UI assets
```

Potentially stale data:

```text
partner health
quota
NPA
frozen status
```

Partner health must be fetched from an authoritative current source when routing occurs.

Never serve a stale branch result as though it were current.

---

# 22. Offline Rules

The source lifecycle allows the four-card intake and deterministic scheme matching to remain functional under intermittent connectivity after the application shell is loaded.

The client may store:

```text
credix_intake_draft
```

in `localStorage`.

Offline mode must not falsely claim:
- dossier creation
- current branch health
- current quota
- current NPA
- successful server persistence

When a network-dependent operation cannot complete, the UI must explain that the action needs connectivity.

---

# 23. API Logging

Log operational metadata, not unnecessary citizen PII.

Useful fields:

```text
request_id
route
duration_ms
status_code
error_code
provider_latency_ms
```

Do not log:
- raw phone numbers
- identity numbers
- full sensitive request payloads
- secrets
- provider API keys

Eligibility and routing logs should be sufficient to debug deterministic behavior without exposing unnecessary personal information.

---

# 24. Performance Contracts

The source specification targets:

```text
Eligibility evaluation < 10ms
```

The eligibility algorithm itself must remain deterministic and lightweight.

The API layer should not introduce unnecessary network calls into the decision path.

Routing should rely on:
- PostGIS `ST_DWithin`
- spatial GIST index
- database-side filtering
- database-side ranking

The client should not download every branch and filter locally.

---

# 25. API Testing Requirements

Every contract must have tests for:

## Eligibility

```text
[ ] valid category
[ ] invalid category
[ ] income below limit
[ ] income above limit
[ ] project cost below minimum
[ ] project cost above maximum
[ ] SC declaration requirement
[ ] male rate selection
[ ] female rate selection
[ ] primary + alternatives
[ ] no-match result
[ ] deterministic repeatability
```

## Repayment

```text
[ ] 90% principal calculation
[ ] 10% promoter contribution
[ ] monthly interest calculation
[ ] moratorium phase
[ ] amortization phase
[ ] EMI formula
[ ] minimum moratorium
[ ] maximum moratorium
[ ] invalid tenure
[ ] zero/invalid rate edge cases
```

## Routing

```text
[ ] valid coordinates
[ ] radius filtering
[ ] inactive partner excluded
[ ] frozen partner excluded
[ ] NPA > 15% excluded
[ ] zero quota excluded
[ ] positive quota retained
[ ] viability score ordering
[ ] max_results respected
[ ] latitude/longitude output
```

## Dossier

```text
[ ] valid dossier creation
[ ] tracking code uniqueness
[ ] invalid scheme rejected
[ ] invalid partner rejected
[ ] invalid moratorium rejected
[ ] server-side consistency validation
[ ] generated status
```

---

# 26. Contract Non-Violation Rules

AI coding agents must never:

- invent a different eligibility algorithm
- call an LLM from `/api/eligibility/evaluate`
- let the client choose authoritative interest rates
- let the client bypass routing killswitches
- filter partner health only in React
- replace PostGIS routing with a browser-only branch scan
- store raw phone numbers when `phone_hash` is required
- expose database errors directly to citizens
- expose provider secrets
- put provider-specific Bhashini payloads into UI components
- hardcode Google Maps destinations
- accept arbitrary navigation URLs from users
- claim a dossier was saved before the database confirms creation
- claim branch health is current when the authoritative routing request failed
- introduce authentication into the zero-auth citizen flow without an approved product change

---

# 27. API Definition of Done

```text
[ ] All application contracts are typed
[ ] Request validation exists
[ ] Response schemas are stable
[ ] Error codes are stable
[ ] Eligibility is deterministic
[ ] Eligibility contains no LLM dependency
[ ] Repayment follows the source formulas
[ ] Routing uses get_solvent_branches
[ ] Routing uses PostGIS ST_DWithin
[ ] NPA > 15% is excluded
[ ] Exhausted quota is excluded
[ ] Frozen partners are excluded
[ ] Inactive partners are excluded
[ ] Dossier creation is server validated
[ ] Tracking code is unique
[ ] Phone data remains hashed
[ ] Google Maps URL uses validated coordinates
[ ] Bhashini is isolated behind an adapter
[ ] API errors do not expose internals
[ ] Public endpoints have abuse protection
[ ] Offline behavior does not fabricate server state
[ ] Contract tests cover success and failure paths
```

---

# 28. Source-of-Truth Rule

For implementation:

```text
Product behavior
→ project_overview.md

Architecture and boundaries
→ architecture.md

Build order
→ build_plan.md

Visual behavior
→ ui_tokens.md
→ ui_rules.md
→ ui_registry.md

Database structure and policy data
→ database_schema.md

Transport and integration contracts
→ api_contracts.md
```

If an API contract conflicts with the authoritative database schema or source product specification, the discrepancy must be resolved before implementation rather than silently changing the underlying policy.
