# Memory — Server-side Localization & Engine Enhancements

Last updated: 2026-09-10T07:23:00+05:30

## What was built

- **Server-Side Localization**: Shifted from purely client-side translation to full-stack localization using Next.js `NEXT_LOCALE` cookies. 
- **Database Schema**: Added `_hi` localized columns for scheme text fields to the Drizzle schema (`src/db/schema/index.ts`) and applied migrations.
- **Scheme Pages**: Updated Server Components (`schemes/page.tsx`, `schemes/[id]/page.tsx`, `dashboard/page.tsx`) to dynamically map Hindi fields based on the cookie.
- **New Schemes**: Added 3 new SC-beneficiary schemes (NSFDC Term Loan, Venture Capital Fund for SC, Stand-Up India) with full translations to the database seed files.
- **Language Toggle**: Redesigned `LanguageToggle.tsx` into a segmented pill control (EN/HI) and fixed client hydration/state syncing issues.
- **Eligibility Engine**: Modified the scoring algorithm in `src/services/recommendation.ts` (both SQL and JS implementations) to grant near-full credit to "universal" schemes. Universal schemes now score 97% instead of ~63%, ensuring users are not falsely told they are a "low match" for broadly applicable schemes.
- **Git Push**: Initialized the project repository and pushed all changes to `origin/main` on GitHub (`adarzhpathade/Eligift-SC`).

## Decisions made

- Next.js server components read `next/headers` cookies (`NEXT_LOCALE`) for data fetching, meaning localization applies even before JavaScript loads on the client.
- Universal eligibility constraints (e.g., no gender specified, no income limit) are rewarded rather than penalized, reflecting true eligibility while still allowing highly-targeted schemes to rank first with 100%.

## Problems solved

- Fixed a TypeScript syntax error (Unterminated template literal) in `recommendation.ts` caused by duplicate return statements during the algorithmic update.
- Fixed the language switch initialization logic to properly persist and sync between server state (cookie) and client state (`i18next`).

## Current state

- The app is successfully localizing server-fetched data and UI components between English and Hindi.
- The recommendation engine is deterministic, accurate, and prioritizes specificity without failing broad schemes.
- The repository is fully tracked and up to date on GitHub.

## Next session starts with

- Address the outstanding onboarding UI requests: 
  - Auto-populate districts based on state selection in onboarding and capture full address.
  - Automate partner branch routing entirely instead of asking the user to select a branch.
  - Defer routing slip generation until "apply now" is clicked.
  - Remove document verification forms and replace them with final loan terms input (just inform users what to carry).

## Open questions

- None.
