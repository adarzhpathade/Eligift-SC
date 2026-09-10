# CrediX — Build Plan

## Build Philosophy

CrediX must be built as a sequence of visible, independently testable features.

The implementation order is:

1. Build the citizen-facing UI.
2. Verify the UI with mock data.
3. Build deterministic domain logic.
4. Wire persistence and authoritative backend behavior.
5. Add external integrations.
6. Harden accessibility, resilience, security, and production behavior.

Do not build invisible backend systems for features that have no usable UI yet.

Every feature must have:
- Feature ID
- Feature Name
- Description
- Dependencies
- Files Impacted
- Acceptance Criteria
- Verification Steps

---

# Phase 1 — Foundation

## Feature 01 — Project Foundation

**Feature ID:** CRX-01

**Feature Name:** Project Foundation

**Description:** Create the Vite React TypeScript application, Tailwind CSS foundation, base routing, PWA manifest, environment handling, and application shell.

**Dependencies:** None

**Files Impacted:**
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/styles/globals.css`
- `public/manifest.webmanifest`
- `public/icons/*`

**Acceptance Criteria:**
- Application starts successfully in development.
- Production build succeeds.
- TypeScript strict mode is enabled.
- Application shell renders on mobile and desktop.
- PWA manifest is valid.
- No secrets are hardcoded.

**Verification Steps:**
1. Run development server.
2. Open the application on mobile and desktop viewport sizes.
3. Run production build.
4. Inspect repository for committed secrets.

---

## Feature 02 — Localization Foundation

**Feature ID:** CRX-02

**Feature Name:** English/Hindi Localization

**Description:** Configure i18next/react-i18next with locally bundled English and Hindi dictionaries.

**Dependencies:** CRX-01

**Files Impacted:**
- `public/locales/en.json`
- `public/locales/hi.json`
- `src/features/localization/i18n.ts`
- `src/features/localization/language.ts`
- application shell components

**Acceptance Criteria:**
- English is available.
- Hindi is available.
- Language can switch without a full page reload.
- Citizen-facing strings are translation keys.
- Missing translations do not crash the application.

**Verification Steps:**
1. Switch English → Hindi.
2. Switch Hindi → English.
3. Navigate through the full intake flow in both languages.
4. Test missing-key fallback in development.

---

## Feature 03 — Design System Foundation

**Feature ID:** CRX-03

**Feature Name:** UI Tokens and Common Primitives

**Description:** Implement the CrediX visual system and reusable controls.

**Dependencies:** CRX-01

**Files Impacted:**
- `src/styles/globals.css`
- `src/components/common/*`
- `ui_tokens.md`
- `ui_rules.md`

**Acceptance Criteria:**
- Semantic color tokens exist.
- Typography hierarchy is implemented.
- Buttons, inputs, cards, badges, alerts, and loading states are reusable.
- Components do not use raw Tailwind color classes.
- Focus states are visible.

**Verification Steps:**
1. Render a component showcase page during development.
2. Test keyboard focus.
3. Compare components against the design tokens.

---

# Phase 2 — Intake Experience

## Feature 04 — Four-Step Intake UI

**Feature ID:** CRX-04

**Feature Name:** Four-Card Intake Wizard

**Description:** Build the complete citizen intake flow using mock data.

**Dependencies:** CRX-02, CRX-03

**Files Impacted:**
- `src/components/intake/IntakeWizard.tsx`
- `src/components/intake/IntakeProgress.tsx`
- `src/components/intake/PurposeCard.tsx`
- `src/components/intake/ProjectCostCard.tsx`
- `src/components/intake/IncomeCard.tsx`
- `src/components/intake/ApplicantDetailsCard.tsx`
- `src/state/intake-store.ts`

**Acceptance Criteria:**
- Exactly four logical intake steps exist:
  1. Purpose
  2. Project Cost
  3. Family Income
  4. Applicant Details
- User can move forward and backward.
- Current values remain available while navigating.
- Required fields are visually identified.
- SC declaration is explicit.
- UI is responsive.

**Verification Steps:**
1. Complete each step.
2. Navigate backward.
3. Confirm previous values remain.
4. Submit incomplete values and verify validation.
5. Test keyboard-only navigation.

---

## Feature 05 — Draft Persistence

**Feature ID:** CRX-05

**Feature Name:** Intake localStorage Draft

**Description:** Persist serializable intake state under `credix_intake_draft`.

**Dependencies:** CRX-04

**Files Impacted:**
- `src/state/intake-store.ts`
- `src/lib/storage.ts`

**Acceptance Criteria:**
- Draft updates are persisted.
- Reload restores valid draft values.
- Corrupted localStorage does not crash the application.
- Draft data can be cleared after successful completion.

**Verification Steps:**
1. Enter values.
2. Reload the page.
3. Verify values are restored.
4. Manually corrupt the localStorage value.
5. Reload and verify safe recovery.

---

## Feature 06 — Voice Input

**Feature ID:** CRX-06

**Feature Name:** Bhashini Speech-to-Text

**Description:** Add explicit voice-input controls for supported text fields.

**Dependencies:** CRX-04

**Files Impacted:**
- `src/features/voice/bhashini.ts`
- `src/features/voice/voice-types.ts`
- relevant intake components

**Acceptance Criteria:**
- User explicitly starts voice input.
- Listening/transcribing state is visible.
- Transcribed content can be edited.
- Microphone denial has a clear fallback.
- Provider failure does not block manual input.
- Credentials remain server-side.

**Verification Steps:**
1. Test successful transcription.
2. Test microphone denial.
3. Test provider timeout.
4. Test malformed provider response.
5. Verify manual entry still works.

---

# Phase 3 — Scheme Catalog and Eligibility

## Feature 07 — Scheme Database

**Feature ID:** CRX-07

**Feature Name:** Scheme Master Catalog

**Description:** Create the `schemes` table and seed the eight application models defined by the CrediX specification.

**Dependencies:** CRX-01

**Files Impacted:**
- `supabase/migrations/002_schemes.sql`
- `supabase/seed/schemes.sql`
- `src/types/index.ts`

**Acceptance Criteria:**
- Scheme records contain:
  - scheme code
  - scheme name
  - category
  - minimum cost
  - maximum cost
  - income limit
  - male interest rate
  - female interest rate
  - government funding percentage
  - promoter margin percentage
  - minimum moratorium
  - maximum moratorium
  - maximum tenure
  - active status
- Eight specified scheme models are seeded.
- Scheme codes are unique.

**Verification Steps:**
1. Apply migration to clean database.
2. Run seed.
3. Query all active schemes.
4. Compare values against the source specification.

---

## Feature 08 — Deterministic Decision Engine

**Feature ID:** CRX-08

**Feature Name:** Scheme Eligibility Engine

**Description:** Evaluate citizen input against active scheme records without using an LLM.

**Dependencies:** CRX-07

**Files Impacted:**
- `src/features/eligibility/decision-engine.ts`
- `src/features/eligibility/ranking.ts`
- `src/features/eligibility/eligibility-types.ts`
- `src/lib/validation.ts`

**Acceptance Criteria:**
- Eligibility is deterministic.
- Inactive schemes are excluded.
- Purpose/category rules are applied.
- Project-cost minimum and maximum rules are applied.
- Income limits are applied from scheme data.
- SC declaration requirements are enforced.
- Eligible schemes are returned.
- One primary scheme is selected deterministically.
- Alternatives are ordered deterministically.
- No LLM request is made.

**Verification Steps:**
1. Test each supported purpose.
2. Test exact minimum cost.
3. Test exact maximum cost.
4. Test just below minimum.
5. Test just above maximum.
6. Test income exactly at limit.
7. Test income above limit.
8. Test SC declaration false.
9. Run the same input repeatedly and compare output.

---

## Feature 09 — Eligibility Results UI

**Feature ID:** CRX-09

**Feature Name:** Scheme Results

**Description:** Display the primary recommendation and secondary eligible schemes.

**Dependencies:** CRX-08

**Files Impacted:**
- `src/components/results/ResultsHeader.tsx`
- `src/components/results/PrimarySchemeCard.tsx`
- `src/components/results/AlternativeSchemes.tsx`
- `src/components/results/EligibilityExplanation.tsx`
- `src/app/routes/ResultsPage.tsx`

**Acceptance Criteria:**
- Primary scheme is visually dominant.
- Scheme name and category are visible.
- Interest rate is visible.
- Financing information is visible.
- Eligibility explanation is understandable.
- Alternatives are clearly separated.
- No-match state is handled.

**Verification Steps:**
1. Test one eligible scheme.
2. Test multiple eligible schemes.
3. Test no eligible schemes.
4. Verify translated content.

---

# Phase 4 — Repayment Engine

## Feature 10 — Funding Calculation

**Feature ID:** CRX-10

**Feature Name:** Government Funding and Promoter Margin

**Description:** Calculate financed amount and promoter contribution using the selected scheme's stored percentages.

**Dependencies:** CRX-08

**Files Impacted:**
- `src/features/repayment/emi-engine.ts`
- `src/features/repayment/repayment-types.ts`

**Acceptance Criteria:**
- Government financing follows the selected scheme funding percentage.
- Promoter contribution follows the selected scheme margin percentage.
- Calculations use the full project cost.
- Display rounding is separate from calculation precision.

**Verification Steps:**
1. Test small project cost.
2. Test scheme maximum project cost.
3. Verify funding + contribution equals project cost according to calculation precision.

---

## Feature 11 — Moratorium-Aware EMI Engine

**Feature ID:** CRX-11

**Feature Name:** Repayment Calculation

**Description:** Implement the supplied two-phase repayment model.

**Dependencies:** CRX-10

**Files Impacted:**
- `src/features/repayment/emi-engine.ts`
- `src/features/repayment/repayment-types.ts`

**Acceptance Criteria:**
- Applicable interest rate is selected by applicant gender where the scheme defines gender-specific rates.
- Monthly rate is derived consistently.
- Moratorium is constrained by scheme limits.
- Active amortization period is calculated as total tenure minus moratorium where the source formula specifies this.
- Phase 1 represents the grace/moratorium period.
- Phase 2 represents active amortization.
- EMI is calculated using the documented formula.
- Financial calculations are deterministic.

**Verification Steps:**
1. Test minimum moratorium.
2. Test maximum moratorium.
3. Test an intermediate moratorium.
4. Test male/female rates for schemes where rates differ.
5. Independently calculate expected EMI and compare.

---

## Feature 12 — Repayment UI

**Feature ID:** CRX-12

**Feature Name:** Funding and EMI Experience

**Description:** Add funding breakdown, moratorium slider, and repayment schedule.

**Dependencies:** CRX-11

**Files Impacted:**
- `src/components/repayment/FundingBreakdown.tsx`
- `src/components/repayment/MoratoriumController.tsx`
- `src/components/repayment/RepaymentSchedule.tsx`

**Acceptance Criteria:**
- Government funding is visible.
- Promoter contribution is visible.
- Interest rate is visible.
- Moratorium min/max is visible.
- Slider changes values immediately.
- EMI updates without page reload.
- Phase 1 and Phase 2 are visually distinguishable.
- Currency values use Indian formatting.

**Verification Steps:**
1. Drag slider from minimum to maximum.
2. Verify EMI updates.
3. Verify active tenure updates.
4. Test on mobile.
5. Test keyboard operation of slider.

---

# Phase 5 — Channel Partner and Geospatial Routing

## Feature 13 — Partner Database

**Feature ID:** CRX-13

**Feature Name:** Channel Partner and Health Schema

**Description:** Create channel partner and partner health tables with PostGIS support.

**Dependencies:** CRX-01

**Files Impacted:**
- `supabase/migrations/003_channel_partners.sql`
- `supabase/migrations/004_partner_health_metrics.sql`
- `supabase/migrations/001_extensions.sql`

**Acceptance Criteria:**
- PostGIS extension is enabled.
- Partner geometry uses `GEOGRAPHY(Point, 4326)`.
- IFSC is unique.
- Partner health references the partner.
- Fiscal-cycle uniqueness exists for partner health.
- GIST index exists on partner geometry.

**Verification Steps:**
1. Apply migrations to clean database.
2. Insert test partner.
3. Insert health metrics.
4. Verify unique constraints.
5. Verify spatial index.

---

## Feature 14 — Branch Routing Function

**Feature ID:** CRX-14

**Feature Name:** Solvent Branch Router

**Description:** Implement geographic radius filtering, policy killswitches, and viability scoring.

**Dependencies:** CRX-13

**Files Impacted:**
- `supabase/migrations/006_routing_functions.sql`
- `src/features/routing/route-branches.ts`
- `src/features/routing/viability.ts`
- `src/features/routing/routing-types.ts`

**Acceptance Criteria:**
- Branches outside the configured radius are excluded.
- Frozen branches are excluded.
- Overdue NPA above 15% is excluded.
- Branches with no remaining quota are excluded.
- Remaining candidates are ranked deterministically.
- Required branch information is returned.
- Routing query uses the spatial index.

**Verification Steps:**
1. Test branch inside radius.
2. Test branch outside radius.
3. Test frozen branch.
4. Test NPA exactly at 15%.
5. Test NPA above 15%.
6. Test zero remaining quota.
7. Test positive remaining quota.
8. Compare ranking with an independently calculated expected score.

---

## Feature 15 — Location Permission

**Feature ID:** CRX-15

**Feature Name:** Citizen Location Capture

**Description:** Request browser geolocation only when branch routing is needed.

**Dependencies:** CRX-14

**Files Impacted:**
- `src/features/routing/route-branches.ts`
- `src/components/branch/BranchSearch.tsx`

**Acceptance Criteria:**
- User sees why location is needed.
- Permission request is explicit.
- Coordinates are validated.
- Permission denial has a human-readable fallback.
- Exact coordinates are not unnecessarily persisted.

**Verification Steps:**
1. Grant permission.
2. Deny permission.
3. Test unavailable location.
4. Test invalid coordinate handling.

---

## Feature 16 — Branch Recommendation UI

**Feature ID:** CRX-16

**Feature Name:** Nearby Viable Branch

**Description:** Display the recommended channel partner and relevant branch details.

**Dependencies:** CRX-14, CRX-15

**Files Impacted:**
- `src/components/branch/BranchCard.tsx`
- `src/components/branch/BranchSearch.tsx`

**Acceptance Criteria:**
- Branch name is visible.
- Bank name is visible.
- Distance is visible.
- Nodal officer/contact is visible.
- Viability/health status is understandable.
- Excluded branches are never displayed as recommendations.
- No-match state is clear.

**Verification Steps:**
1. Test one viable branch.
2. Test multiple branches.
3. Test no viable branches.
4. Test routing service failure.

---

# Phase 6 — Dossier and Citizen Actions

## Feature 17 — Anonymous Loan Dossier

**Feature ID:** CRX-17

**Feature Name:** Dossier Creation

**Description:** Persist the validated citizen result with an anonymous tracking code.

**Dependencies:** CRX-09, CRX-12, CRX-16

**Files Impacted:**
- `supabase/migrations/005_loan_dossiers.sql`
- `src/features/dossier/create-dossier.ts`
- `src/features/dossier/tracking-code.ts`

**Acceptance Criteria:**
- Dossier is created only after server-side validation.
- Tracking code is unique.
- Selected scheme is referenced.
- Selected partner is referenced.
- Calculated EMI is stored.
- Selected moratorium is stored.
- Required project/income values are stored.
- Phone is hashed where required.
- No unnecessary sensitive information is persisted.

**Verification Steps:**
1. Create a valid dossier.
2. Attempt duplicate tracking code.
3. Submit invalid scheme reference.
4. Submit invalid partner reference.
5. Inspect stored data for unnecessary PII.

---

## Feature 18 — Google Maps Navigation

**Feature ID:** CRX-18

**Feature Name:** Branch Navigation

**Description:** Generate direct Google Maps directions links for the selected branch.

**Dependencies:** CRX-16

**Files Impacted:**
- `src/lib/maps.ts`
- `src/components/branch/BranchCard.tsx`

**Acceptance Criteria:**
- Link uses validated branch latitude/longitude.
- Destination is correctly encoded.
- No embedded map is used.
- Link works on mobile and desktop.

**Verification Steps:**
1. Open link on desktop.
2. Open link on mobile.
3. Test decimal coordinates.
4. Test negative longitude where applicable.

---

## Feature 19 — Routing Slip PDF

**Feature ID:** CRX-19

**Feature Name:** Printable Routing Slip

**Description:** Generate a one-page routing slip from the validated dossier/result.

**Dependencies:** CRX-17

**Files Impacted:**
- `src/features/dossier/routing-slip.ts`
- `src/components/branch/RoutingSlipButton.tsx`

**Acceptance Criteria:**
- PDF is generated successfully.
- Tracking code is prominent.
- Selected scheme is included.
- Selected branch is included.
- Relevant repayment summary is included.
- Personal data is minimized.
- Hindi text renders correctly where included.

**Verification Steps:**
1. Generate PDF for a normal result.
2. Generate PDF for Hindi.
3. Open generated PDF.
4. Verify one-page layout.
5. Verify no unnecessary sensitive information is present.

---

## Feature 20 — QR Tracking Reference

**Feature ID:** CRX-20

**Feature Name:** Tracking QR

**Description:** Add a QR representation of the safe tracking reference to the routing slip/result.

**Dependencies:** CRX-17

**Files Impacted:**
- `src/features/dossier/routing-slip.ts`
- QR utility/module

**Acceptance Criteria:**
- QR contains only the approved tracking reference or safe retrieval target.
- QR is scannable.
- QR does not encode raw personal data.

**Verification Steps:**
1. Generate QR.
2. Scan using a mobile device.
3. Verify decoded value.
4. Inspect QR payload.

---

# Phase 7 — Production Hardening

## Feature 21 — PWA Offline Asset Caching

**Feature ID:** CRX-21

**Feature Name:** Offline-Tolerant Shell

**Description:** Cache application shell, static assets, icons, and locale files.

**Dependencies:** CRX-01, CRX-02, CRX-05

**Files Impacted:**
- `src/workers/service-worker.ts`
- PWA/Vite configuration

**Acceptance Criteria:**
- Previously loaded UI can reopen without network.
- Local draft remains available.
- Dynamic branch-health data is not falsely presented as current offline.
- Cache versions can be updated safely.

**Verification Steps:**
1. Load application online.
2. Disable network.
3. Reload.
4. Verify shell and draft.
5. Re-enable network and verify update behavior.

---

## Feature 22 — Accessibility and Responsive QA

**Feature ID:** CRX-22

**Feature Name:** Accessibility Pass

**Description:** Perform a complete accessibility and responsive review.

**Dependencies:** CRX-04 through CRX-21

**Files Impacted:** Project-wide.

**Acceptance Criteria:**
- Keyboard navigation works.
- Visible focus exists.
- Form labels are correctly associated.
- Validation errors are accessible.
- Dynamic EMI/result changes are announced appropriately.
- Color is not the sole status indicator.
- Mobile layouts do not overflow.
- Reduced-motion preference is respected.

**Verification Steps:**
1. Complete keyboard-only walkthrough.
2. Perform screen-reader smoke test.
3. Test common mobile viewport sizes.
4. Test tablet.
5. Test desktop.
6. Run accessibility tooling.

---

## Feature 23 — Error and Resilience Pass

**Feature ID:** CRX-23

**Feature Name:** Failure-State Hardening

**Description:** Verify all external and database failure paths.

**Dependencies:** CRX-06, CRX-14, CRX-17, CRX-19

**Files Impacted:** Project-wide.

**Acceptance Criteria:**
- Network failure produces a human-readable message.
- Bhashini failure falls back to manual input.
- Location denial is handled.
- Routing failure is handled.
- PDF failure is handled.
- Database failure does not expose raw provider errors.
- No sensitive data is included in logs.

**Verification Steps:**
1. Simulate network failure.
2. Simulate database failure.
3. Simulate Bhashini failure.
4. Simulate location denial.
5. Simulate PDF failure.
6. Inspect logs.

---

## Feature 24 — Security and Production Readiness

**Feature ID:** CRX-24

**Feature Name:** Production Hardening

**Description:** Perform final security, deployment, migration, and operational verification.

**Dependencies:** CRX-22, CRX-23

**Files Impacted:** Project-wide.

**Acceptance Criteria:**
- No secret appears in client bundle.
- Database migrations are reproducible.
- Seed data is reproducible.
- Public inputs are validated.
- Public dossier creation has abuse protection.
- Sensitive information is not unnecessarily logged.
- Production build succeeds.
- Deployment configuration is documented.

**Verification Steps:**
1. Build from clean checkout.
2. Run migrations from empty database.
3. Run seed.
4. Inspect client bundle for secrets.
5. Test malformed API/database inputs.
6. Verify production deployment.

---

# Dependency Graph

```text
CRX-01 Foundation
├── CRX-02 Localization
├── CRX-03 Design System
├── CRX-07 Scheme Database
└── CRX-13 Partner Database

CRX-02 + CRX-03
└── CRX-04 Intake UI
    ├── CRX-05 Draft Persistence
    └── CRX-06 Voice Input

CRX-07
└── CRX-08 Eligibility Engine
    └── CRX-09 Results UI
        └── CRX-17 Dossier

CRX-08
└── CRX-10 Funding
    └── CRX-11 EMI Engine
        └── CRX-12 Repayment UI

CRX-13
└── CRX-14 Routing
    ├── CRX-15 Location
    └── CRX-16 Branch UI
        ├── CRX-17 Dossier
        └── CRX-18 Maps

CRX-17
├── CRX-19 Routing Slip
└── CRX-20 QR

CRX-01 + CRX-02 + CRX-05
└── CRX-21 PWA

CRX-04 through CRX-21
└── CRX-22 Accessibility
    └── CRX-23 Resilience
        └── CRX-24 Production Readiness
```

# Build Order Rule

An AI coding agent must not skip ahead because a later feature appears easier.

The required implementation order is:

```text
CRX-01
CRX-02
CRX-03
CRX-04
CRX-05
CRX-06
CRX-07
CRX-08
CRX-09
CRX-10
CRX-11
CRX-12
CRX-13
CRX-14
CRX-15
CRX-16
CRX-17
CRX-18
CRX-19
CRX-20
CRX-21
CRX-22
CRX-23
CRX-24
```

A feature is not complete merely because its code exists. Its acceptance criteria and verification steps must pass before the next dependent feature begins.
