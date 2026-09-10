# CrediX — Architecture

## Architecture Goal

CrediX is a public, anonymous, multilingual PWA whose critical decisions are deterministic and auditable.

The architecture separates:

- citizen-facing presentation
- intake state
- deterministic eligibility
- financial calculations
- geospatial routing
- dossier persistence
- external integrations
- document generation

No LLM is part of the authoritative eligibility or routing decision path.

## Technology Stack

| Technology | Purpose | Reason for Selection |
|---|---|---|
| React.js | Citizen interface | Fast client-side UI and strong component model |
| Vite | Build tooling | Fast development and production builds |
| TypeScript | Application language | Strong typing across domain models |
| Tailwind CSS | Styling | Consistent utility-based design system |
| PWA / Service Worker | Offline asset support | Useful for intermittent connectivity |
| i18next | Localization | Local bundled language dictionaries |
| react-i18next | React localization integration | Simple translated UI rendering |
| Supabase | Backend platform | PostgreSQL, PostGIS, API and persistence |
| PostgreSQL 15 | Relational database | Strong constraints and transactional integrity |
| PostGIS | Geospatial database extension | Efficient radius and spatial queries |
| Bhashini Speech-to-Text API | Optional voice input | Regional-language voice assistance |
| Google Maps Intent URLs | Navigation | Direct navigation without embedded map infrastructure |
| PDF generation library | Routing slip | Printable/downloadable output |
| QR-code library | Tracking reference | Simple physical/digital handoff |

## Architectural Principles

### 1. Deterministic Policy Core
Scheme eligibility is calculated using explicit code and scheme records.

### 2. Server-Authoritative Results
The browser may calculate preview values for responsiveness, but persisted eligibility, routing, and dossier values must be validated by trusted server/database logic.

### 3. Separation of Concerns
UI components must not own policy rules, database queries, or financial formulas.

### 4. Anonymous by Default
The core citizen journey does not require authentication.

### 5. Offline-Tolerant Intake
The citizen can continue entering information even when network connectivity is unavailable. Authoritative submission remains a network operation.

### 6. Minimal External Dependencies
Google Maps is opened through an intent URL rather than embedding a map. Bhashini is only invoked when the user explicitly requests voice input.

## Folder Structure

```text
/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── manifest.webmanifest
│   ├── icons/
│   └── locales/
│       ├── en.json
│       └── hi.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── app/
│   │   └── routes/
│   │       ├── HomePage.tsx
│   │       └── ResultsPage.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── intake/
│   │   │   ├── IntakeWizard.tsx
│   │   │   ├── IntakeProgress.tsx
│   │   │   ├── PurposeCard.tsx
│   │   │   ├── ProjectCostCard.tsx
│   │   │   ├── IncomeCard.tsx
│   │   │   └── ApplicantDetailsCard.tsx
│   │   ├── results/
│   │   │   ├── ResultsHeader.tsx
│   │   │   ├── PrimarySchemeCard.tsx
│   │   │   ├── AlternativeSchemes.tsx
│   │   │   └── EligibilityExplanation.tsx
│   │   ├── repayment/
│   │   │   ├── FundingBreakdown.tsx
│   │   │   ├── MoratoriumController.tsx
│   │   │   └── RepaymentSchedule.tsx
│   │   ├── branch/
│   │   │   ├── BranchSearch.tsx
│   │   │   ├── BranchCard.tsx
│   │   │   └── RoutingSlipButton.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Checkbox.tsx
│   │       ├── Badge.tsx
│   │       ├── Alert.tsx
│   │       └── LoadingState.tsx
│   ├── features/
│   │   ├── eligibility/
│   │   │   ├── decision-engine.ts
│   │   │   ├── ranking.ts
│   │   │   └── eligibility-types.ts
│   │   ├── repayment/
│   │   │   ├── emi-engine.ts
│   │   │   ├── repayment-types.ts
│   │   │   └── currency.ts
│   │   ├── routing/
│   │   │   ├── route-branches.ts
│   │   │   ├── viability.ts
│   │   │   └── routing-types.ts
│   │   ├── dossier/
│   │   │   ├── create-dossier.ts
│   │   │   ├── tracking-code.ts
│   │   │   └── routing-slip.ts
│   │   ├── localization/
│   │   │   ├── i18n.ts
│   │   │   └── language.ts
│   │   └── voice/
│   │       ├── bhashini.ts
│   │       └── voice-types.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── maps.ts
│   │   ├── storage.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── state/
│   │   └── intake-store.ts
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css
│   └── workers/
│       └── service-worker.ts
├── supabase/
│   ├── migrations/
│   │   ├── 001_extensions.sql
│   │   ├── 002_schemes.sql
│   │   ├── 003_channel_partners.sql
│   │   ├── 004_partner_health_metrics.sql
│   │   ├── 005_loan_dossiers.sql
│   │   └── 006_routing_functions.sql
│   └── seed/
│       └── schemes.sql
└── docs/
    └── context/
```

## Frontend Architecture

### Application Entry
`src/main.tsx` initializes React, localization, and the application shell.

### Routing
The initial release has two primary screens:

- `/` — landing page + intake wizard
- `/results` — eligibility, repayment, branch routing, and action result

A route-level guard is not required because the application is anonymous.

### Intake State

The intake state contains only serializable citizen inputs:

```text
purpose
projectCost
annualIncome
applicantName
gender
isScDeclared
```

The intake state layer:

- validates state transitions
- persists drafts
- restores drafts
- clears drafts after successful completion when appropriate

### Component Responsibilities

Components may:

- render fields
- display validation messages
- invoke callbacks
- display calculated domain results
- trigger explicit user actions

Components must not:

- query the database directly
- contain SQL
- implement scheme eligibility
- calculate EMI formulas
- decide which branch is viable

## Backend Architecture

Supabase is the persistence and geospatial backend.

### Data Access Boundary

All database interaction should pass through dedicated feature/data-access modules.

The UI must never directly construct database queries.

### Eligibility Service

Inputs:

```text
IntakeInput
+
ActiveScheme[]
```

Output:

```text
EligibilityResult
```

The service evaluates:

- SC requirement
- purpose/category
- project-cost range
- income limit
- applicant-specific scheme conditions
- scheme active status

### Repayment Service

Inputs:

```text
SelectedScheme
+
ProjectCost
+
Moratorium
+
ApplicantGender
```

Output:

```text
RepaymentResult
```

It calculates:

- government-financed amount
- promoter contribution
- applicable interest rate
- moratorium
- active tenure
- EMI
- phase breakdown

### Routing Service

Inputs:

```text
latitude
longitude
radius
fiscalCycle
```

Output:

```text
BranchRoutingResult[]
```

The database performs spatial filtering and policy exclusion before the application ranks the returned branches, unless the supplied SQL function encapsulates the full ranking.

## Data Flow

### Intake

```text
Citizen
  ↓
React form
  ↓
Intake state
  ↓
Validation
  ↓
localStorage draft
```

### Eligibility

```text
Validated intake
  ↓
Active scheme catalog
  ↓
Deterministic decision engine
  ↓
Eligible schemes
  ↓
Deterministic ranking
  ↓
Primary + alternatives
```

### Repayment

```text
Primary scheme
  ↓
Funding calculation
  ↓
Moratorium selection
  ↓
Repayment engine
  ↓
EMI + phase schedule
```

### Routing

```text
Browser geolocation
  ↓
Validated coordinates
  ↓
PostGIS ST_DWithin
  ↓
Policy killswitch
  ↓
Viability scoring
  ↓
Ranked branch
```

### Dossier

```text
Validated intake
+
Primary scheme
+
Repayment
+
Selected branch
  ↓
Server-side validation
  ↓
loan_dossiers insert
  ↓
Tracking code
  ↓
Routing slip
```

## Database Architecture

The core relational model contains:

- `schemes`
- `channel_partners`
- `partner_health_metrics`
- `loan_dossiers`

`channel_partners.geom` uses `GEOGRAPHY(Point, 4326)`.

A GIST index supports geographic proximity filtering.

Partner health is versioned by fiscal cycle through:

```text
(partner_id, fiscal_cycle)
```

as a unique pair.

The dossier references the selected scheme and partner rather than copying the full catalog records.

## Geospatial Architecture

Use PostGIS for authoritative branch filtering.

Conceptually:

```sql
ST_DWithin(
  channel_partners.geom,
  ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
  :radius_meters
)
```

The query must also enforce the routing killswitch:

- `is_frozen = false`
- `overdue_npa_ratio <= 0.15`
- remaining quota greater than zero

The exact viability formula must live in one documented implementation.

## Security Architecture

### Browser
The browser may hold only public client configuration.

### Server
Sensitive provider credentials remain server-side.

### Database
Use least-privilege access policies appropriate to the anonymous/public flow.

### Personal Data
Avoid storing unnecessary personal information.

The dossier must not contain raw credentials or secrets.

Phone data should be hashed where the specification requires only a reference/hash.

### Location
Location is used for routing and should not be persisted unless required for the dossier or explicitly specified.

### QR Code
The QR should contain only an approved tracking reference or safe retrieval target.

## Performance

### Eligibility
Keep the decision engine pure and in-memory.

### Database
Use:
- primary-key indexes
- unique indexes
- spatial GIST index
- fiscal-cycle uniqueness constraint

### Frontend
- Lazy-load non-critical functionality where useful.
- Avoid embedded maps.
- Keep locale files small.
- Cache static assets through the service worker.

### Network
Do not repeatedly fetch the same scheme catalog during a single intake flow.

## Deployment

### Frontend
Build the Vite application into static production assets and deploy to a CDN/static host.

### Backend
Use Supabase for:
- PostgreSQL
- PostGIS
- RPC
- persistence

### Environment Separation
Development, staging, and production must use separate credentials/configuration.

## Monitoring

Monitor:

- frontend runtime errors
- API/RPC failures
- branch-query latency
- dossier creation failures
- PDF generation failures
- Bhashini errors
- service-worker update issues
- database query latency

Do not log:

- full applicant names
- phone numbers
- raw intake payloads
- exact coordinates unless operationally necessary
- authentication/secrets

## Caching

### Cacheable
- application shell
- static JavaScript/CSS
- icons
- locale dictionaries

### Carefully Cached
- scheme catalog, with explicit freshness policy

### Not Permanently Cached
- partner health
- quota
- routing results

Authoritative branch health and quota data must not be represented as current after its freshness boundary.

## Architectural Constraints

1. No authentication for the core citizen journey.
2. Eligibility is deterministic.
3. LLMs are not used for policy decisions.
4. Financial calculations are deterministic.
5. Branch health is authoritative from database data.
6. PostGIS performs proximity filtering.
7. Google Maps is external navigation only.
8. Intake drafts use localStorage.
9. UI does not directly access the database.
10. Secrets never enter the client bundle.
11. Policy constants must not be duplicated across components.
12. No feature may silently reinterpret government policy.

## Non-Violation Rules

- Business logic never lives in presentation components.
- Database access never lives inside UI components.
- API boundaries validate all input.
- Policy rules are centralized.
- Financial formulas are centralized.
- Routing exclusion rules are centralized.
- Components remain reusable.
- No unnecessary abstraction is introduced before repeated usage exists.
- Do not introduce an AI dependency where deterministic code is sufficient.
