# CrediX — Project Overview

## Core Vision

CrediX is a zero-friction, multilingual Progressive Web Application (PWA) designed to help Scheduled Caste (SC) beneficiaries identify suitable concessional government credit schemes and understand the practical next steps required to pursue them.

The platform simplifies three difficult decisions:

1. Which government credit scheme fits the applicant's purpose, project cost, income, and applicant details?
2. What will the financing and repayment actually look like after accounting for the scheme's moratorium?
3. Which nearby channel-partner branch is currently viable based on distance, quota availability, branch health, and policy exclusions?

CrediX must remain deterministic at its policy core. Eligibility and routing decisions are driven by explicit rules and authoritative database values, not by an LLM.

## Problem Statement

Government credit programs can be difficult for citizens to navigate because scheme rules, financing limits, repayment conditions, and channel-partner availability are spread across complex information.

Even after identifying a potentially suitable scheme, an applicant may not know:

- whether their project cost falls within the scheme range
- whether their annual income satisfies the applicable limit
- how much the government finances
- how much promoter contribution is required
- how the moratorium changes repayment
- which nearby branch is currently suitable
- whether a branch is affected by NPA or quota conditions

CrediX converts these decisions into a guided citizen workflow.

## Target Audience

The primary audience is Scheduled Caste beneficiaries seeking concessional government credit for purposes such as:

- Small business
- Machinery
- Transport
- Education
- Sanitation

The interface must also serve citizens with varying levels of digital and textual literacy.

## User Personas

### First-Time Applicant
A citizen who has never applied for a government-backed concessional loan before.

**Needs:**
- Simple questions
- Plain-language explanations
- Clear eligibility result
- Clear financing breakdown
- Clear next action

### Small-Business Beneficiary
A citizen seeking funding to start or expand a small business.

**Needs:**
- Fast scheme matching
- Project-cost validation
- Government funding versus self-contribution
- Nearby viable branch

### Education Applicant
A student or family member seeking an educational loan.

**Needs:**
- Appropriate education scheme identification
- Clear financial limits
- Understandable repayment information
- Simple application-routing guidance

### Low-Digital-Literacy Citizen
A citizen who may find long text forms difficult to complete.

**Needs:**
- Four-step guided intake
- Large, obvious controls
- Hindi language support
- Optional voice-to-text input
- Minimal technical terminology

## User Journey

1. **Open CrediX** — no account is required for the core flow.
2. **Complete four-card intake** — Purpose, Project Cost, Family Income, Applicant Details.
3. **Persist draft locally** under `credix_intake_draft`.
4. **Submit intake** for validation and deterministic evaluation.
5. **Receive scheme results** — one primary recommendation and secondary eligible alternatives.
6. **Review financing** — government funding, promoter contribution, interest, moratorium, tenure, and EMI.
7. **Find a viable branch** using location, distance, NPA health, quota, and frozen status.
8. **Take action** through Google Maps navigation and a downloadable routing slip with an anonymous tracking code.

## User Stories

### Intake
- As a citizen, I want to select my loan purpose so that CrediX can identify relevant schemes.
- As a citizen, I want to enter my project cost so that schemes can be filtered by financing range.
- As a citizen, I want to enter my family income so that income-limited schemes can be evaluated.
- As a citizen, I want to explicitly declare my SC status.
- As a citizen, I want to provide basic applicant details needed for scheme selection.
- As a citizen, I want my unfinished form to be preserved locally.

### Eligibility
- As a citizen, I want one clear primary scheme recommendation.
- As a citizen, I want to see alternative eligible schemes when available.
- As a citizen, I want to understand why a scheme matches my inputs.
- As a citizen, I want the eligibility result to be deterministic and trustworthy.

### Repayment
- As a citizen, I want to see how much of my project cost is financed.
- As a citizen, I want to know my promoter contribution.
- As a citizen, I want to adjust the moratorium.
- As a citizen, I want the EMI to update when the moratorium changes.
- As a citizen, I want to understand the grace-period and amortization phases.

### Branch Routing
- As a citizen, I want to find nearby viable branches.
- As a citizen, I want branches with disqualifying health conditions excluded.
- As a citizen, I want to see distance and contact information.
- As a citizen, I want to navigate directly to the recommended branch.

### Action
- As a citizen, I want a tracking code for my submission.
- As a citizen, I want a printable/downloadable routing slip.

### Accessibility
- As a citizen, I want to use CrediX in Hindi.
- As a citizen, I want optional voice input for supported fields.
- As a citizen, I want clear error messages instead of technical errors.

## Features In Scope

- Multilingual PWA
- English and Hindi localization
- Four-card intake wizard
- Responsive mobile-first interface
- Draft persistence through localStorage
- Accessible forms
- Optional Bhashini speech-to-text input
- Scheme master catalog
- Deterministic decision engine
- Primary scheme selection
- Secondary eligible alternatives
- Eligibility explanations
- Government financing calculation
- Promoter contribution calculation
- Moratorium controls
- Moratorium-aware repayment schedule
- EMI calculation
- Channel-partner branch database
- Partner health metrics
- Geographic radius search
- PostGIS `ST_DWithin`
- NPA policy killswitch
- Frozen-branch exclusion
- Quota/remaining-allocation exclusion
- Viability scoring
- Branch contact information
- Google Maps navigation
- Anonymous loan dossier
- Unique tracking code
- Routing-slip PDF
- QR representation of the approved tracking reference

## Features Out Of Scope

- User accounts
- Login or OTP authentication
- Automatic loan-application submission
- Automated underwriting
- Credit scoring
- LLM-based eligibility decisions
- Embedded maps
- Automatic approval guarantees
- Loan disbursement processing
- Payments
- Subscription billing
- Team accounts
- Unspecified government schemes
- Automatic policy changes
- Unreviewed AI-generated policy rules

## Functional Requirements

### FR-01 — Intake
Provide a four-step intake flow covering Purpose, Project Cost, Family Income, and Applicant Details.

### FR-02 — Draft Persistence
Persist the intake draft under `credix_intake_draft` and safely handle missing or malformed stored data.

### FR-03 — Income Validation
Use authoritative scheme data for income limits. The initial catalog uses ₹5,00,000 as the default annual income limit where applicable.

### FR-04 — SC Declaration
Require an explicit SC declaration. Never infer SC status from other attributes.

### FR-05 — Deterministic Scheme Evaluation
Eligibility must be calculated from explicit rules and scheme records. Identical inputs and catalog state must produce identical results. LLMs must not decide eligibility.

### FR-06 — Primary Scheme
When multiple schemes are eligible, select one primary scheme using a documented deterministic ranking policy.

### FR-07 — Alternatives
Present other eligible schemes in deterministic order.

### FR-08 — Financing
Calculate government financing and promoter contribution from the selected scheme's stored percentages.

### FR-09 — Moratorium
Constrain the selected moratorium to the selected scheme's configured minimum and maximum.

### FR-10 — EMI
Calculate repayment using the selected scheme's applicable interest rate and tenure while accounting for moratorium.

### FR-11 — Branch Routing
Use geographic distance and partner health/allocation data to identify viable branches.

### FR-12 — Policy Killswitch
Do not present branches that fail configured policy conditions. The supplied specification defines overdue NPA above 15% as an exclusion condition.

### FR-13 — Dossier
Create an anonymous dossier containing required scheme, partner, financial, and tracking information.

### FR-14 — Navigation
Generate a Google Maps directions link from validated branch coordinates.

### FR-15 — Routing Slip
Generate a downloadable routing slip containing the tracking reference and required next-step information.

### FR-16 — Localization
All citizen-facing strings must use localization keys. English and Hindi are required for the initial release.

### FR-17 — Voice Input
Bhashini speech-to-text is optional and must never block manual entry.

## Non-Functional Requirements

- Policy decisions must be deterministic and reproducible.
- The decision engine should execute in memory without unnecessary network calls.
- The interface must be mobile-first and responsive.
- Forms must support keyboard navigation, visible focus, labels, accessible errors, and dynamic result announcements.
- The application must degrade gracefully when location, Bhashini, PDF generation, or network services fail.
- Secrets must never be exposed to the browser.
- Sensitive applicant information must not be unnecessarily logged or embedded in URLs/QR codes.
- PostgreSQL/PostGIS queries must use appropriate indexes.
- Important policy values must remain centralized and auditable.

## Success Criteria

1. A citizen can complete the intake without creating an account.
2. Draft data survives reload.
3. Eligibility results are deterministic.
4. A primary eligible scheme is identified when one exists.
5. Alternative schemes are presented when applicable.
6. Financing and promoter contribution are clearly displayed.
7. Moratorium changes update repayment correctly.
8. Disallowed branches are excluded.
9. A viable nearby branch can be ranked.
10. Google Maps navigation opens the intended destination.
11. A unique tracking code is generated.
12. A routing slip can be downloaded.
13. English and Hindi interfaces work.
14. Voice-input failure does not block manual completion.
15. No secrets or unnecessary sensitive data are exposed.

## Future Expansion

- Additional Indian languages
- Additional government credit schemes
- More channel-partner types
- Administrative catalog management
- Scheme-policy versioning
- Data freshness dashboards
- Assisted-service-center workflows
- Additional accessibility features
- More detailed repayment comparisons
- Branch operating-hour information
- Government document checklists
- Application-status integrations where an authoritative API exists

Future expansion must preserve the deterministic policy boundary.
