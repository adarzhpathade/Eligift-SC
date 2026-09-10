# CrediX — Code Standards

## 1. Purpose

This document defines the implementation standards for CrediX.

The goal is to keep the codebase:
- predictable for human engineers
- easy for AI coding agents to understand
- deterministic where financial or eligibility decisions are involved
- secure by default
- accessible
- maintainable without unnecessary abstraction

All new code must follow these rules unless an existing architecture decision explicitly requires otherwise.

---

# 2. General Engineering Principles

1. Prefer simple, explicit code over clever abstractions.
2. Keep business logic independent from presentation.
3. Keep database access out of UI components.
4. Keep API/database boundary code thin.
5. Validate untrusted input at boundaries.
6. Never use an LLM for eligibility, ranking, financial calculations, or policy enforcement.
7. Prefer pure functions for domain calculations.
8. Reuse existing components and utilities before creating new ones.
9. Avoid premature abstraction.
10. Do not modify unrelated files while implementing a feature.
11. Preserve existing contracts unless the active feature explicitly changes them.
12. Every production behavior must have a clear failure state.

---

# 3. File Naming

Use lowercase kebab-case for ordinary files.

Examples:

```text
decision-engine.ts
emi-engine.ts
tracking-code.ts
route-branches.ts
intake-store.ts
```

React components use PascalCase filenames when the file exports a primary component:

```text
IntakeWizard.tsx
PrimarySchemeCard.tsx
RepaymentSchedule.tsx
```

Test files use:

```text
decision-engine.test.ts
emi-engine.test.ts
IntakeWizard.test.tsx
```

Do not create ambiguous filenames such as:

```text
utils.ts
helpers.ts
misc.ts
stuff.ts
common.ts
```

unless the file has a clearly defined bounded responsibility.

---

# 4. Folder Standards

Use the architecture defined in `architecture.md`.

Recommended structure:

```text
src/
├── app/
│   └── routes/
├── components/
│   ├── common/
│   ├── intake/
│   ├── results/
│   ├── repayment/
│   ├── branch/
│   └── layout/
├── features/
│   ├── eligibility/
│   ├── repayment/
│   ├── routing/
│   ├── dossier/
│   ├── localization/
│   └── voice/
├── lib/
├── state/
├── types/
├── styles/
└── workers/
```

Feature-specific logic belongs in the relevant `features/` directory.

Shared UI belongs in `components/`.

Shared infrastructure belongs in `lib/`.

Global client state belongs in `state/`.

Do not place business rules in `components/`.

---

# 5. TypeScript Standards

## 5.1 Strict Mode

TypeScript strict mode is mandatory.

Avoid:

```ts
const value: any = response.data;
```

Prefer:

```ts
const value: Scheme = parseScheme(response.data);
```

Use `unknown` for untrusted values and narrow them explicitly.

```ts
function parseResponse(value: unknown): Scheme {
  // validate and narrow value
}
```

---

## 5.2 Explicit Domain Types

Create named types for domain concepts.

```ts
export type Gender = "male" | "female" | "other";

export type IntakePurpose =
  | "self_employment"
  | "education"
  | "housing"
  | "transport"
  | "other";
```

Do not repeatedly use anonymous string unions throughout the codebase.

---

## 5.3 Interfaces vs Types

Use `type` for:
- unions
- aliases
- composed data shapes

Use `interface` when describing extensible object contracts.

Examples:

```ts
export type SchemeCode = string;

export interface Scheme {
  id: string;
  code: SchemeCode;
  name: string;
  active: boolean;
}
```

Do not create interfaces for every primitive alias.

---

## 5.4 Nullability

Handle nullable values explicitly.

Avoid:

```ts
const name = partner.name!;
```

Prefer:

```ts
if (!partner.name) {
  return fallbackPartnerLabel;
}

return partner.name;
```

Non-null assertions are allowed only when the invariant is established immediately and documented.

---

# 6. React Standards

## 6.1 Component Responsibility

A component should primarily:
- render UI
- receive props
- coordinate UI interactions
- call feature hooks/actions

A component should not:
- calculate eligibility
- calculate EMI
- query raw database tables
- implement routing scoring
- contain policy rules

Bad:

```tsx
function SchemeCard({ income }: Props) {
  const eligible = income <= 300000;
  // ...
}
```

Good:

```tsx
function SchemeCard({ scheme, eligibility }: Props) {
  // render already-calculated domain state
}
```

---

## 6.2 Props

Prefer explicit props.

```ts
interface SchemeCardProps {
  scheme: Scheme;
  isPrimary: boolean;
  onSelect?: (schemeId: string) => void;
}
```

Avoid passing large generic objects when a component needs only a few fields.

---

## 6.3 Component Size

When a component becomes difficult to reason about, split it by responsibility.

Do not split every small JSX fragment into a component.

A component should generally have one clear reason to change.

---

## 6.4 Hooks

Custom hooks must begin with `use`.

Examples:

```text
useIntakeDraft.ts
useEligibility.ts
useGeolocation.ts
useRepayment.ts
```

Hooks should coordinate state/effects, not become dumping grounds for business logic.

Pure calculations belong in feature modules.

---

# 7. State Management

Use the smallest appropriate state scope.

### Local component state

Use for:
- temporary UI state
- open/closed state
- input interaction state
- transient loading indicators

### Intake store

Use for:
- multi-step intake values
- draft persistence
- wizard progress

### Server/domain state

Use for:
- schemes
- channel partners
- health metrics
- dossier status

Do not duplicate the same authoritative value across multiple stores.

The database remains authoritative for persisted scheme and partner data.

---

# 8. Business Logic Standards

Business logic must be deterministic and testable.

Important CrediX rules include:
- scheme eligibility
- scheme ranking
- funding percentage
- promoter contribution
- interest rate selection
- moratorium constraints
- EMI calculation
- branch radius filtering
- NPA killswitch
- quota filtering
- partner viability scoring

These rules must not be implemented inside JSX.

Use pure domain functions where possible.

Example:

```ts
export function calculateFunding(
  projectCost: number,
  governmentFundingPercent: number,
) {
  return projectCost * (governmentFundingPercent / 100);
}
```

---

# 9. Financial Calculation Standards

Financial calculations must use consistent numeric handling.

Rules:
1. Do not use formatted currency strings as calculation inputs.
2. Keep calculation precision separate from display precision.
3. Never use `parseFloat("₹1,25,000")`.
4. Validate that monetary inputs are finite and non-negative.
5. Apply explicit rounding rules at the display boundary.
6. Test boundary values.
7. Never silently coerce invalid financial values to zero.

Example:

```ts
const projectCost = 125000;

if (!Number.isFinite(projectCost) || projectCost < 0) {
  throw new ValidationError("Invalid project cost");
}
```

Financial formulas must be documented next to the domain implementation or in the relevant feature documentation.

---

# 10. Eligibility Engine Standards

The eligibility engine is a policy engine, not an AI generation system.

Rules:
- no LLM calls
- no probabilistic eligibility
- no hidden heuristics
- no random ranking
- no browser-only policy enforcement
- active schemes only
- every exclusion must be attributable to a known rule

Prefer structured results:

```ts
interface EligibilityResult {
  eligible: boolean;
  reasons: EligibilityReason[];
}
```

Use machine-readable reason codes.

```ts
type EligibilityReasonCode =
  | "INCOME_EXCEEDED"
  | "PROJECT_COST_TOO_LOW"
  | "PROJECT_COST_TOO_HIGH"
  | "PURPOSE_NOT_SUPPORTED"
  | "SC_DECLARATION_REQUIRED";
```

Human-readable text belongs in the presentation/localization layer.

---

# 11. Routing Standards

Geospatial routing is policy-sensitive.

The routing layer must enforce:
- geographic radius
- active/frozen status
- NPA killswitch
- remaining quota
- deterministic viability ranking

Do not rely on the client to enforce these rules.

The client may display the result, but authoritative filtering must occur in the backend/database boundary.

Never expose an excluded branch as a recommended branch.

---

# 12. API and Supabase Standards

The application must treat database and external-provider responses as untrusted input.

Every boundary should:

1. validate request data
2. execute the operation
3. validate the response shape
4. map provider errors into safe application errors
5. log only safe diagnostic information

Do not expose:
- SQL errors
- stack traces
- secret values
- provider credentials
- internal table structure

to citizens.

---

# 13. Database Access Standards

Database access must be isolated from presentation components.

Do not write database calls inside:

```text
components/
```

Prefer:

```text
features/
lib/
```

or the designated backend/RPC layer.

Use explicit column selection.

Prefer:

```ts
select("id, code, name, active")
```

over retrieving unnecessary columns.

Never use unrestricted wildcard data retrieval for sensitive records.

---

# 14. Validation Standards

Validate at every trust boundary.

Validation is required for:
- intake form submission
- URL/query parameters
- geolocation values
- scheme identifiers
- partner identifiers
- dossier creation
- external provider responses
- database function inputs

Validation must reject invalid values rather than silently correcting them.

Examples of invalid values:
- negative income
- negative project cost
- NaN
- Infinity
- malformed UUID
- latitude outside `[-90, 90]`
- longitude outside `[-180, 180]`

---

# 15. Error Handling

Use typed application errors.

Example:

```ts
export class ValidationError extends Error {
  readonly code = "VALIDATION_ERROR";
}
```

Recommended error categories:

```text
VALIDATION_ERROR
NOT_FOUND
ELIGIBILITY_ERROR
ROUTING_ERROR
DATABASE_ERROR
PROVIDER_ERROR
LOCATION_ERROR
PDF_ERROR
UNKNOWN_ERROR
```

Never display raw exception messages to citizens.

Map technical failures to localized user-facing messages.

---

# 16. Logging Standards

Logs must be useful without exposing sensitive information.

Safe examples:

```text
eligibility.evaluation.completed
routing.no_viable_branch
bhashini.transcription.failed
dossier.creation.failed
```

Avoid logging:
- full phone numbers
- full names
- raw intake payloads
- precise location coordinates unless operationally necessary
- authentication secrets
- API keys
- complete database records

Use identifiers such as dossier IDs or tracking references only when safe.

---

# 17. Security Standards

## Secrets

Never commit secrets.

Never put provider API keys into:
- React source
- Vite public environment variables
- localStorage
- URLs
- generated PDFs

Provider credentials must remain in server-side configuration.

## Client Trust

Never trust the client for:
- eligibility
- scheme limits
- partner health
- NPA filtering
- quota enforcement
- dossier authorization

Client calculations are for responsiveness and presentation only when the authoritative result is subsequently validated.

## Input Safety

Treat all citizen input as untrusted.

## Data Minimization

Store only data required for the documented CrediX workflow.

---

# 18. Localization Standards

All citizen-facing text must use translation keys.

Bad:

```tsx
<button>Check Eligibility</button>
```

Good:

```tsx
<button>{t("intake.checkEligibility")}</button>
```

Translation keys should be stable and hierarchical.

Example:

```text
intake.purpose.title
intake.purpose.validation.required
results.primary.title
repayment.emi.label
branch.navigation.openMaps
errors.location.denied
```

Do not concatenate translated fragments to form sentences when grammatical ordering differs between languages.

---

# 19. Accessibility Standards

All interactive elements must be keyboard accessible.

Required:
- semantic HTML
- associated labels
- visible focus
- meaningful button names
- accessible error messages
- sufficient contrast
- non-color status indicators
- accessible slider labels
- accessible loading states

Do not use:

```html
<div onClick={...}>
```

when a semantic button is appropriate.

---

# 20. Tailwind Standards

Use Tailwind utilities through the project design tokens.

Prefer semantic token classes such as:

```text
bg-background
text-foreground
bg-primary
text-primary-foreground
border-border
```

Avoid arbitrary values unless there is a documented reason.

Avoid repeatedly copying long utility strings. Extract a reusable component when the same visual pattern appears repeatedly.

Do not introduce a second styling system.

---

# 21. Component Reuse

Before creating a component:

1. Search `src/components/`.
2. Search `ui_registry.md`.
3. Check whether an existing component can be configured through props.
4. Extend the existing component if the new behavior is genuinely reusable.

Do not create:

```text
PrimaryButton.tsx
PrimaryActionButton.tsx
MainButton.tsx
EligibilityButton.tsx
```

when one reusable button component is sufficient.

---

# 22. API Naming

Use resource-oriented, predictable naming.

Examples:

```text
/schemes
/schemes/:schemeId
/branches/nearby
/dossiers
/dossiers/:trackingCode
```

Use HTTP semantics consistently.

- `GET` — retrieve
- `POST` — create/action
- `PATCH` — partial update
- `DELETE` — remove where supported

Do not create inconsistent verb-heavy routes unless an operation is genuinely an action.

---

# 23. Database Naming

Use:
- `snake_case`
- plural table names where established
- singular semantic meaning for columns
- explicit foreign-key names

Examples:

```text
channel_partners
partner_health_metrics
loan_dossiers
scheme_code
project_cost
income_annual
tracking_code
```

Primary keys should use UUIDs as defined by the project schema.

Do not rename established schema fields simply for stylistic preference.

---

# 24. Migration Standards

Every database change must be a migration.

Never rely on manual dashboard-only schema changes for production.

Migrations must:
- be ordered
- be reproducible
- use explicit constraints
- include indexes where required
- avoid destructive changes without an explicit migration strategy

Each migration should have one coherent purpose.

---

# 25. Testing Standards

Every deterministic domain function must have unit tests.

Minimum test coverage should include:
- happy path
- boundary values
- invalid inputs
- policy exclusions
- failure conditions

Critical functions requiring strong tests:
- eligibility engine
- scheme ranking
- funding calculation
- EMI calculation
- routing filters
- viability score
- tracking code generation

---

# 26. Test Naming

Tests should describe behavior.

Good:

```ts
it("rejects income above the scheme limit", () => {});
```

Good:

```ts
it("excludes branches with NPA above 15 percent", () => {});
```

Avoid:

```ts
it("works", () => {});
```

---

# 27. Performance Standards

Do not optimize prematurely, but protect critical paths.

Rules:
- eligibility evaluation should remain deterministic and fast
- avoid unnecessary database round trips
- use spatial indexes for geographic queries
- avoid rendering large lists unnecessarily
- debounce expensive user-driven operations where appropriate
- do not block the main thread with avoidable synchronous work
- cache stable static resources

Do not trade correctness for micro-optimizations.

---

# 28. External Provider Standards

External integrations include:
- Bhashini
- Google Maps

Provider-specific code must be isolated.

Recommended pattern:

```text
src/features/voice/bhashini.ts
src/lib/maps.ts
```

The rest of the application should consume project-defined interfaces rather than provider-specific response shapes.

This makes provider failures and future replacement manageable.

---

# 29. PDF Standards

Generated routing slips must:
- be deterministic
- contain only approved information
- remain readable when printed
- support required languages
- avoid leaking secrets
- fail gracefully

PDF generation belongs in the dossier feature, not in arbitrary UI components.

---

# 30. Environment Variables

Use environment variables for configuration.

Separate:
- public client configuration
- server-only secrets

Never expose server-only secrets through `VITE_*` variables.

Maintain an example environment file:

```text
.env.example
```

It must contain variable names and safe example values only.

---

# 31. Import Standards

Prefer path aliases when configured.

Avoid deep relative imports such as:

```ts
../../../../features/eligibility/decision-engine
```

Prefer:

```ts
@/features/eligibility/decision-engine
```

Keep imports ordered consistently:
1. external libraries
2. internal aliases
3. relative imports
4. types

Use type-only imports where appropriate:

```ts
import type { Scheme } from "@/types";
```

---

# 32. Comments and Documentation

Comments should explain why, not what.

Bad:

```ts
// Add 1 to i
i += 1;
```

Good:

```ts
// The active repayment period excludes the selected moratorium.
const activeMonths = tenureMonths - moratoriumMonths;
```

Document:
- non-obvious policy decisions
- financial formulas
- security assumptions
- provider quirks
- migration hazards

Do not use comments to preserve dead code.

---

# 33. Dead Code

Do not leave:
- commented-out implementations
- unused imports
- unused components
- abandoned feature flags
- duplicate utilities

If functionality is intentionally disabled, document the reason and removal/activation condition.

---

# 34. Git and Change Hygiene

Each feature should produce a coherent change set.

Avoid mixing:
- eligibility changes
- unrelated UI redesign
- database cleanup
- dependency upgrades

in one feature implementation.

AI coding agents must inspect the current working tree before modifying files and must not overwrite unrelated user work.

---

# 35. AI Coding Agent Rules

AI agents working on CrediX must:

1. Read `agent.md`.
2. Read the required context files.
3. Identify the active feature in `progress_tracker.md`.
4. Read the feature's acceptance criteria.
5. Inspect existing implementation before editing.
6. Reuse existing abstractions.
7. Implement only the active feature and required dependencies.
8. Run relevant tests.
9. Run type checks.
10. Run lint.
11. Run the production build where appropriate.
12. Update `progress_tracker.md` only after verification.

Agents must not invent undocumented policy rules.

If a requirement is unclear, the agent must preserve the documented behavior and surface the ambiguity rather than silently changing product policy.

---

# 36. Forbidden Patterns

The following are prohibited:

```text
LLM-based eligibility decisions
LLM-based EMI calculations
LLM-based branch health decisions
business logic inside JSX
raw database calls inside presentation components
hardcoded scheme policy values in UI
hardcoded NPA/quota policy in client-only code
secrets in client code
secrets in localStorage
raw provider errors shown to users
unvalidated external responses
silent coercion of invalid financial inputs
duplicate design-system components
manual production-only database changes
unrelated refactors during feature work
```

---

# 37. Definition of Code Quality

Code is acceptable only when it is:

- correct
- deterministic where required
- typed
- validated
- testable
- accessible
- localized
- secure
- reasonably performant
- consistent with the architecture
- reusable where reuse is justified
- understandable by a future AI coding agent

The shortest implementation that satisfies these requirements is preferred over unnecessary complexity.


## Animation & Motion Standards

### Responsibility Boundary

Animation belongs to the presentation/UI layer.

Never place animation logic in:
- eligibility services
- repayment services
- routing services
- database access
- API contracts
- domain models

Business logic produces state. UI code decides how that state is presented.

### Library Selection

Use this decision rule:

```text
Simple state transition?
→ CSS/Tailwind

React component transition?
→ Framer Motion

Complex timeline/choreography?
→ GSAP
```

Do not add another animation dependency without explicit justification.

### Shared Motion

Prefer a shared UI location such as:

```text
src/lib/motion/
```

for variants, transitions, reduced-motion helpers, and GSAP timelines.

Do not duplicate the same animation configuration across components.

### Naming

Use descriptive names:

```ts
fadeUp
cardEnter
cardExit
modalEnter
modalExit
resultReveal
```

Avoid generic names such as:

```ts
animation1
coolAnimation
thingMotion
```

### React Lifecycle

Framer Motion must follow normal React lifecycle behavior.

GSAP timelines must be cleaned up when their owning component unmounts.

No animation may continue after its owning component has been removed.

### Performance

Prefer:

```text
transform
opacity
```

Avoid unnecessary animation of layout properties.

Animation must not create measurable layout instability.

### Accessibility

Every non-essential animation must respect:

```text
prefers-reduced-motion
```

Animation must never be required to:
- understand a financial amount
- submit a form
- access navigation
- read an error
- confirm dossier creation

### Testing

Animation changes should be checked for:
- mobile viewport behavior
- desktop viewport behavior
- reduced-motion behavior
- keyboard navigation
- focus visibility
- unmount cleanup
- layout stability
- interaction latency

### Forbidden Animation Patterns

Do not:
- add animation merely because a library is installed
- use animation to disguise slow APIs
- animate sensitive financial information excessively
- create infinite decorative loops on the main intake screen
- use GSAP where CSS is sufficient
- use Framer Motion where CSS is sufficient
- put animation code inside domain/business services
