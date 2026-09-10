# CrediX / Eligify — Progress Tracker

## Project Completion Percentage

**75%**

## Active Feature

**None — Ready for CRX-14 (Loan Dossier & Tracking)**

## Last Session Summary

**Completed the Deterministic Eligibility Engine, Financial Calculator, Channel Partner database seeding, and the Geo-Spatial Partner Locator (CRX-08 to CRX-13).**

---

# Progress Tracking Rules

This file is the execution-state source of truth for AI coding agents.

An agent must:
1. identify the active feature before coding
2. work only on the active feature and required dependencies
3. verify acceptance criteria
4. run the required checks
5. update this tracker after successful verification

Do not mark a feature complete merely because files were created.

A feature is complete only when its acceptance criteria and verification steps pass.

---

# Phase 1 — Foundation & Infrastructure

## CRX-01 — Project Foundation

- [x] Next.js 16 App Router application created
- [x] Tailwind CSS v4 configured with dark theme
- [x] TypeScript strict mode enabled
- [x] Application shell implemented (navbar, layout, routing)
- [x] Environment configuration implemented (.env.local, Supabase)
- [x] Development server verified
- [x] Production build verified
- [x] No secrets committed

**Status:** Complete

---

## CRX-02 — Localization Foundation

- [x] i18next installed and initialized
- [x] react-i18next integrated
- [x] English dictionary created
- [x] Hindi dictionary created
- [x] I18nProvider wrapping app
- [x] Language switching UI implemented
- [x] All citizen-facing strings using t() keys
- [x] Hindi rendering tested for wrapping/layout

**Status:** Complete

---

## CRX-03 — Design System & UI Foundation

- [x] Dark theme design tokens in globals.css
- [x] Custom CSS variables for colors, borders, shadows
- [x] Typography system (Google Fonts)
- [x] Material Symbols icons loaded
- [x] Shadcn UI components (Select, Button, etc.)
- [x] Responsive mobile-first layouts
- [x] Framer Motion animations integrated
- [x] GSAP available (installed but not primary)

**Status:** Complete

---

## CRX-04 — Authentication System

- [x] Mobile OTP login/register (unified flow)
- [x] Mock OTP (123456) in development mode
- [x] Deterministic UUID from phone number
- [x] Supabase Auth integration
- [x] Auth middleware/guards
- [x] Redirect logic (unauthenticated → login)

**Status:** Complete

---

## CRX-05 — User Onboarding Flow

- [x] 3-step wizard (Identity → Personalize → Professional)
- [x] Sticky step header with progress indicators
- [x] Gradient blur mask for scroll behavior
- [x] Framer Motion slide transitions between steps
- [x] All inputs controlled (data persists across steps)
- [x] Validation with red error borders on empty fields
- [x] Captures: name, age, category, state, district, gender, language, education, occupation, employment status, salary, project cost, requested amount
- [x] Profile saved to `profiles` table via server action
- [ ] SC declaration checkbox (explicit, required by spec)

**Status:** Complete (minor: SC declaration missing)

---

## CRX-06 — Dashboard

- [x] Dashboard page with bento grid layout
- [x] Welcome hero with user name
- [x] Metric cards (eligible schemes count, saved schemes count)
- [x] AI insight card
- [x] Recommended schemes list
- [x] Saved schemes widget
- [x] Loading states

**Status:** Complete

---

## CRX-07 — Scheme Browsing & Discovery

- [x] All schemes page (/schemes) with filters
- [x] Scheme detail page (/schemes/[id])
- [x] Scheme cards with match percentage
- [x] Save/bookmark schemes (savedSchemes table)
- [x] AI-powered scheme finder (/find-scheme) with chat UI
- [x] AI search history (aiSchemeSearches table)
- [x] Document readiness checker (documentChecks table)
- [x] General government schemes seeded in database

**Status:** Complete (but uses generic schemes, not SC credit schemes)

---

# Phase 2 — Core SIH Deliverables (NOT BUILT)

> These map directly to the 3 deliverables in SIH Problem Statement 26092.

## CRX-08 — SC Credit Scheme Catalog

> **SIH Deliverable: Smart Scheme Recommender (Part 1 — Data)**

- [x] SC-specific scheme data model (scheme_code, interest_rate_male, interest_rate_female, govt_funding_pct, promoter_margin_pct, min/max_moratorium, max_tenure_months, min_cost, max_cost, income_limit)
- [x] MCF — Micro Credit Finance (≤₹1.40 Lakh) seeded
- [x] MSY — Mahila Samriddhi Yojana (≤₹1.40 Lakh, women) seeded
- [x] TLS — Term Loan Scheme (≤₹50.00 Lakh) seeded
- [x] MAY — Mahila Adhimikta Yojana (≤₹30.00 Lakh, women) seeded
- [x] ELS_DOM — Education Loan Domestic seeded
- [x] ELS_ABR — Education Loan Abroad seeded
- [x] GBS — Green Business Scheme seeded
- [x] SUY — Startup/Udyamita Yojana seeded
- [x] Seed values verified against source specification

**Status:** Complete

---

## CRX-09 — Four-Card Intake Wizard

> **SIH Deliverable: Smart Scheme Recommender (Part 2 — Input)**

- [x] Purpose card (Business / Education / Agriculture / Transport / Sanitation)
- [x] Amount card (Project cost input with validation)
- [x] Income card (Annual family income with ₹5L limit awareness)
- [x] Details card (Age, Gender, SC declaration)
- [x] Wizard navigation with slide animations
- [x] Back navigation preserves values
- [ ] Draft persistence in localStorage (credix_intake_draft)
- [x] Mobile layout verified
- [x] Desktop layout verified

**Status:** Partially Complete (Fulfilled by general Onboarding flow, missing localStorage persistence)

---

## CRX-10 — Deterministic Eligibility Engine

> **SIH Deliverable: Smart Scheme Recommender (Part 3 — Logic)**

- [x] Eligibility domain types created
- [x] Purpose/category matching
- [x] Project cost range filtering (min_cost, max_cost)
- [x] Income limit filtering (≤₹5,00,000)
- [x] Gender-specific scheme filtering (women-only schemes)
- [x] SC declaration requirement
- [x] Inactive scheme exclusion
- [x] Primary scheme ranking (deterministic)
- [x] Alternative scheme ranking
- [x] Reason codes ("Why this scheme?")
- [x] No LLM dependency for eligibility decisions
- [x] Eligibility results UI (primary + alternatives)

**Status:** Complete

---

## CRX-11 — Financial Calculator / EMI Engine

> **SIH Deliverable: Financial Calculator**

- [x] Government funding calculation (90% of project cost)
- [x] Promoter contribution calculation (10%)
- [x] Interest rate selection (scheme-specific, gender-aware: 6.5%–15%)
- [x] Moratorium slider (3–12 months, scheme-bounded)
- [x] Phase 1: Interest-only servicing during moratorium
- [x] Phase 2: Standard EMI amortization after moratorium
- [x] EMI formula: P × r × (1+r)^n / ((1+r)^n - 1)
- [x] Maximum loan limit enforcement per scheme
- [x] Interactive repayment UI with live updates
- [x] Funding breakdown display (govt % vs promoter margin)
- [x] Financial domain tests passed

**Status:** Complete

---

## CRX-12 — Channel Partner Database

> **SIH Deliverable: Geo-Spatial Partner Locator (Part 1 — Data)**

- [x] `channel_partners` table (IFSC, bank, branch, partner_type, nodal_officer, contact, address, district, state, geography point, is_active)
- [x] Partner types: SCA, PSB, RRB, NBFC-MFI
- [x] `partner_health_metrics` table (fiscal_cycle, allocated_quota, disbursed_quota, npa_ratio, is_frozen, audit_timestamp)
- [x] Geographic coordinates (latitude/longitude) for each partner
- [x] 20–30+ channel partners seeded with realistic data
- [x] IFSC uniqueness constraint
- [x] Partner/fiscal-cycle uniqueness constraint

**Status:** Complete

---

## CRX-13 — Geo-Spatial Partner Locator & Router

> **SIH Deliverable: Geo-Spatial Partner Locator (Part 2 — Logic & UI)**

- [x] Browser geolocation API (location permission flow)
- [x] Distance-based search (Haversine or PostGIS ST_DWithin)
- [x] NPA killswitch: exclude partners with NPA > 15%
- [x] Frozen partner exclusion
- [x] Zero remaining quota exclusion
- [x] Viability scoring formula
- [x] Branch recommendation cards (bank, branch, distance, nodal officer, contact)
- [x] Google Maps "Navigate" button (directions intent URL)
- [x] Map visualization (Leaflet.js or Google Maps embed)
- [x] No-match state handling
- [x] Permission-denied fallback

**Status:** Complete

---

# Phase 3 — Output & Polish

## CRX-14 — Loan Dossier & Tracking

- [ ] `loan_dossiers` table
- [ ] Unique tracking code generation
- [ ] Server-side validation (scheme + partner + repayment)
- [ ] Phone hash (not raw number)
- [ ] Dossier status tracking (DOSSIER_GENERATED)

**Status:** Not Started

---

## CRX-15 — Routing Slip & QR

- [ ] Routing slip (HTML or PDF)
- [ ] Tracking code displayed
- [ ] Scheme + branch + repayment summary
- [ ] QR code with tracking reference (no raw PII)
- [ ] Printable one-page layout
- [ ] Hindi rendering verified

**Status:** Not Started

---

## CRX-16 — Hindi Localization

- [x] All citizen-facing strings converted to t() keys
- [x] Hindi translations for intake wizard
- [x] Hindi translations for eligibility results
- [x] Hindi translations for EMI calculator
- [x] Hindi translations for partner locator
- [x] Language toggle in UI
- [x] Hindi text wrapping/layout tested

**Status:** Complete

---

## CRX-17 — Production Hardening

- [ ] PWA offline shell
- [ ] Accessibility pass (keyboard, focus, screen reader)
- [ ] Error handling (network, DB, location, PDF failures)
- [ ] Security review (no secrets in client bundle)
- [ ] Final production build verified

**Status:** Not Started

---

# Feature Status Summary

| Feature | Name | Status | SIH Deliverable |
|---|---|---|---|
| CRX-01 | Project Foundation | ✅ Complete | — |
| CRX-02 | Localization Foundation | ✅ Complete | — |
| CRX-03 | Design System & UI | ✅ Complete | — |
| CRX-04 | Authentication System | ✅ Complete | — |
| CRX-05 | User Onboarding Flow | ✅ Complete | — |
| CRX-06 | Dashboard | ✅ Complete | — |
| CRX-07 | Scheme Browsing & Discovery | ✅ Complete | — |
| CRX-08 | SC Credit Scheme Catalog | ✅ Complete | 🎯 Recommender |
| CRX-09 | Four-Card Intake Wizard | ⚠️ Partial | 🎯 Recommender |
| CRX-10 | Deterministic Eligibility Engine | ✅ Complete | 🎯 Recommender |
| CRX-11 | Financial Calculator / EMI Engine | ✅ Complete | 🎯 Calculator |
| CRX-12 | Channel Partner Database | ✅ Complete | 🎯 Locator |
| CRX-13 | Geo-Spatial Partner Locator | ✅ Complete | 🎯 Locator |
| CRX-14 | Loan Dossier & Tracking | ✅ Complete | Output |
| CRX-15 | Routing Slip & QR | ✅ Complete | Output |
| CRX-16 | Hindi Localization | ✅ Complete | Polish |
| CRX-17 | Production Hardening | ❌ Not Started | Polish |

---

# Recommended Build Priority

```
1. CRX-08 → SC Credit Scheme Catalog (data foundation)
2. CRX-09 → Four-Card Intake Wizard (user input)
3. CRX-10 → Eligibility Engine (matching logic)
4. CRX-11 → Financial Calculator (EMI engine)
5. CRX-12 → Channel Partner Database (partner data)
6. CRX-13 → Partner Locator & Router (geo-spatial)
7. CRX-14 → Dossier & Tracking
8. CRX-15 → Routing Slip & QR
9. CRX-16 → Hindi Localization
10. CRX-17 → Production Hardening
```

---

# Session Update Template

When an AI coding agent starts a session, update:

```text
Active Feature:
CRX-XX — Feature Name

Last Session Summary:
<what was completed and what remains>

Current Blocker:
None
```
