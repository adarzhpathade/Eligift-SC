# CrediX — Library Documentation

## 1. Purpose

This document defines how the major CrediX libraries and platform dependencies are installed, initialized, used, abstracted, tested, and operated.

The project should use the smallest practical dependency set.

Libraries must support the architecture defined in `architecture.md` and the implementation rules in `code_standards.md`.

---

# 2. React

## Purpose

React provides the citizen-facing component model and application UI.

## Installation

React is included through the Vite React TypeScript project.

```bash
npm install react react-dom
```

## Initialization

The application entry point is:

```text
src/main.tsx
```

It mounts the root application component into the browser document.

## Usage Pattern

Use functional components.

```tsx
interface SchemeCardProps {
  name: string;
  rate: number;
}

export function SchemeCard({ name, rate }: SchemeCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{rate}% interest</p>
    </article>
  );
}
```

## Best Practices

- Keep components focused.
- Use semantic HTML.
- Keep business logic outside JSX.
- Prefer explicit props.
- Avoid unnecessary global state.
- Reuse design-system components.

## Common Mistakes

- Putting eligibility logic inside components.
- Direct database queries from components.
- Giant components containing entire workflows.
- Duplicate UI primitives.
- Using non-semantic clickable elements.

## Failure Modes

React rendering failures should be contained with appropriate application-level error boundaries where useful.

User-facing failures must provide recovery guidance instead of exposing stack traces.

## Recommended Abstraction

Use feature components for domain workflows:

```text
src/components/intake/
src/components/results/
src/components/repayment/
src/components/branch/
```

---

# 3. Vite

## Purpose

Vite provides the development server, module bundling, and production build pipeline.

## Installation

```bash
npm install -D vite
```

## Initialization

Configuration belongs in:

```text
vite.config.ts
```

## Usage Pattern

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

## Best Practices

- Keep configuration small.
- Use TypeScript path aliases consistently.
- Avoid unnecessary plugins.
- Keep environment variables explicit.
- Verify production builds regularly.

## Common Mistakes

- Exposing secrets through `VITE_*` variables.
- Depending on development-only behavior.
- Adding plugins without a concrete requirement.
- Ignoring production bundle behavior.

## Failure Modes

A broken Vite configuration can prevent both local development and deployment.

Run a production build after significant configuration changes.

---

# 4. TypeScript

## Purpose

TypeScript provides static typing across the application and is particularly important for financial, eligibility, routing, and database domain models.

## Installation

```bash
npm install -D typescript
```

## Initialization

Configuration belongs in:

```text
tsconfig.json
```

## Usage Pattern

Define explicit domain types.

```ts
export interface Scheme {
  id: string;
  code: string;
  name: string;
  active: boolean;
  incomeLimit: number;
}
```

Use `unknown` for untrusted data.

```ts
function parseScheme(value: unknown): Scheme {
  // validate before returning Scheme
}
```

## Best Practices

- Keep strict mode enabled.
- Prefer narrow domain types.
- Avoid `any`.
- Use type-only imports.
- Validate external data before casting.

## Common Mistakes

```ts
const scheme = response.data as Scheme;
```

A type assertion does not validate the runtime value.

## Failure Modes

Compile-time correctness does not guarantee runtime correctness. External responses still require validation.

## Recommended Abstraction

Keep shared domain types in:

```text
src/types/
```

Feature-specific types may live within their feature directory.

---

# 5. Tailwind CSS

## Purpose

Tailwind provides utility-based styling while CrediX design tokens define the semantic visual language.

## Installation

Install the version compatible with the selected Vite/Tailwind setup.

```bash
npm install tailwindcss
```

## Initialization

Tailwind configuration and global styles should follow the project configuration.

Primary styling foundation:

```text
src/styles/globals.css
```

## Usage Pattern

Prefer semantic design tokens:

```tsx
<div className="bg-background text-foreground border-border">
```

Use responsive utilities:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2">
```

## Best Practices

- Use the values defined in `ui_tokens.md`.
- Build reusable components for repeated patterns.
- Keep responsive behavior explicit.
- Use focus-visible states.
- Respect reduced-motion preferences.

## Common Mistakes

- Arbitrary values everywhere.
- Hardcoded colors that bypass the design system.
- Repeating huge class strings.
- Introducing a second CSS framework.

## Failure Modes

Inconsistent utility usage can cause visual drift across the product.

## Recommended Abstraction

Reusable components should own recurring Tailwind patterns.

---

# 6. i18next

## Purpose

i18next manages CrediX localization.

CrediX must support at minimum:
- English
- Hindi

## Installation

```bash
npm install i18next
```

## Initialization

Create:

```text
src/features/localization/i18n.ts
```

Example:

```ts
import i18n from "i18next";

i18n.init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        "intake.title": "Check your eligibility",
      },
    },
    hi: {
      translation: {
        "intake.title": "अपनी पात्रता जांचें",
      },
    },
  },
});
```

The actual project should keep dictionaries in:

```text
public/locales/en.json
public/locales/hi.json
```

## Best Practices

- Use stable translation keys.
- Keep citizen-facing text out of JSX literals.
- Provide English fallback.
- Keep validation messages localized.
- Preserve meaning rather than translating word-for-word.

## Common Mistakes

- Missing keys throughout the UI.
- Building sentences from translated fragments.
- Using English literals in error states.
- Translating database codes instead of mapping them to localized labels.

## Failure Modes

A missing translation must not crash the application.

Fallback language should be available.

## Recommended Abstraction

Use a localization feature boundary:

```text
src/features/localization/
```

---

# 7. react-i18next

## Purpose

react-i18next connects i18next to React components.

## Installation

```bash
npm install react-i18next
```

## Initialization

Initialize i18next before rendering the application.

## Usage Pattern

```tsx
import { useTranslation } from "react-i18next";

export function IntakeTitle() {
  const { t } = useTranslation();

  return <h1>{t("intake.title")}</h1>;
}
```

## Best Practices

- Keep translation keys semantic.
- Use namespaces if the catalog becomes large.
- Avoid embedding business logic in translation calls.
- Pass structured interpolation values when needed.

## Common Mistakes

Do not write:

```tsx
t("loan." + scheme.code)
```

unless the key space is deliberately controlled and validated.

Prefer explicit mapping for domain labels.

## Failure Modes

If a translation key is missing, use the configured fallback behavior.

---

# 8. Supabase

## Purpose

Supabase provides the managed PostgreSQL database, authentication/infrastructure primitives where required, and database access layer for CrediX.

CrediX's authoritative data lives in PostgreSQL.

## Installation

```bash
npm install @supabase/supabase-js
```

## Initialization

Create a single configured client module, for example:

```text
src/lib/supabase.ts
```

Example:

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
```

Only values intended for the browser may be exposed through `VITE_*`.

## Usage Pattern

Prefer feature-level repositories/services over database calls scattered across components.

```ts
const { data, error } = await supabase
  .from("schemes")
  .select("id, code, name, active")
  .eq("active", true);
```

## Best Practices

- Select only required columns.
- Validate returned data.
- Keep business rules in domain modules/database functions.
- Use migrations for schema changes.
- Protect sensitive operations server-side.
- Use database constraints as a second line of defense.

## Common Mistakes

- Querying tables directly from presentation components.
- Trusting client-provided policy values.
- Selecting every column.
- Treating database validation as optional.
- Putting secrets into browser configuration.

## Failure Modes

Supabase/network failures must be mapped to safe application errors.

Do not expose raw Postgres error text to citizens.

## Recommended Abstraction

Use:

```text
src/lib/supabase.ts
src/features/*/
```

with feature-specific data access functions.

---

# 9. PostgreSQL 15

## Purpose

PostgreSQL is the authoritative relational database for:
- scheme catalog
- channel partners
- partner health metrics
- loan dossiers

## Installation

No application-level installation is required when using Supabase-managed PostgreSQL.

## Initialization

Database setup is performed through ordered migrations:

```text
supabase/migrations/
```

## Usage Pattern

Use relational constraints for important invariants.

Examples:
- primary keys
- foreign keys
- unique scheme codes
- unique IFSC values
- valid status values
- fiscal-cycle uniqueness

## Best Practices

- Use explicit data types.
- Add indexes for real query patterns.
- Keep migrations reproducible.
- Keep financial values in appropriate numeric types.
- Store geographic values using PostGIS geography types.
- Prefer database constraints for invariants.

## Common Mistakes

- Duplicating policy data in frontend constants.
- Missing indexes on frequently filtered fields.
- Removing constraints to make development easier.
- Performing manual production schema changes.

## Failure Modes

Database errors must be handled at the application boundary.

Migrations must be tested from a clean database.

---

# 10. PostGIS

## Purpose

PostGIS enables geographic branch routing and radius queries.

CrediX uses geographic coordinates to identify viable nearby channel partners.

## Initialization

Enable PostGIS through a migration.

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

## Data Type

Partner locations should use:

```sql
GEOGRAPHY(Point, 4326)
```

## Spatial Index

The partner location column must have a GIST index.

Example:

```sql
CREATE INDEX channel_partners_location_gist
ON channel_partners
USING GIST (location);
```

## Usage Pattern

Use spatial filtering at the database/backend boundary.

Conceptually:

```sql
ST_DWithin(
  location,
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
  radius_meters
)
```

## Best Practices

- Validate latitude and longitude.
- Use geography for distance calculations where appropriate.
- Use the spatial index.
- Keep routing policy authoritative on the backend/database side.
- Do not expose excluded branches as recommendations.

## Common Mistakes

- Calculating branch distance only in the browser.
- Forgetting the spatial index.
- Mixing latitude and longitude order.
- Accepting invalid coordinates.

## Failure Modes

If geographic routing fails, show a safe fallback state and do not fabricate a nearby branch.

---

# 11. PWA / Service Worker

## Purpose

The PWA layer allows the CrediX application shell and selected static resources to remain usable during intermittent connectivity.

## Initialization

Service-worker implementation belongs in:

```text
src/workers/service-worker.ts
```

PWA configuration belongs in the Vite configuration.

## Caching Strategy

Cache:
- application shell
- static assets
- icons
- locale dictionaries

Do not present stale dynamic branch health as current.

## Best Practices

- Version caches.
- Remove obsolete caches during activation.
- Keep dynamic policy data authoritative.
- Test offline reload behavior.

## Common Mistakes

- Caching sensitive dynamic records.
- Treating offline cached branch health as live.
- Never invalidating old caches.

## Failure Modes

A service-worker failure must not prevent the normal online application from functioning.

---

# 12. Browser Geolocation API

## Purpose

The browser Geolocation API obtains the citizen's approximate current location for branch routing.

## Initialization

No third-party package is required.

Use:

```ts
navigator.geolocation.getCurrentPosition(...)
```

## Usage Pattern

Request location only when it is relevant to branch routing.

## Best Practices

- Explain why location is requested.
- Ask only when needed.
- Validate returned coordinates.
- Handle permission denial.
- Avoid unnecessary persistence of precise coordinates.

## Common Mistakes

- Requesting location immediately on page load.
- Assuming permission is granted.
- Persisting coordinates without a documented reason.
- Treating location as authoritative identity.

## Failure Modes

Handle:
- permission denied
- position unavailable
- timeout
- browser unsupported

with clear fallback UI.

---

# 13. Bhashini Speech-to-Text

## Purpose

Bhashini provides speech-to-text assistance for supported intake fields.

Voice input is an optional convenience feature. Manual typing/input must always remain available.

## Integration Boundary

Provider-specific code belongs in:

```text
src/features/voice/bhashini.ts
```

Do not spread provider-specific response handling throughout React components.

## Initialization

Provider credentials/configuration must remain server-side.

The browser should call the application's safe integration boundary rather than exposing provider secrets.

## Usage Pattern

The flow should be:

```text
Citizen presses microphone
        ↓
Permission / recording state
        ↓
Application voice integration boundary
        ↓
Bhashini
        ↓
Validated transcription
        ↓
Editable intake field
```

## Best Practices

- Explicit user activation.
- Show listening/transcribing state.
- Allow editing.
- Provide manual fallback.
- Validate provider response.
- Apply timeouts.
- Avoid logging raw speech content unnecessarily.

## Common Mistakes

- Exposing API credentials in the frontend.
- Automatically activating the microphone.
- Making voice input mandatory.
- Trusting provider output without validation.

## Failure Modes

Provider timeout, malformed response, unavailable service, or permission denial must return the user to manual input without blocking the intake flow.

---

# 14. Google Maps Intent URL

## Purpose

Google Maps is used only for navigation from the recommended branch.

CrediX does not require an embedded map.

## Initialization

No Google Maps JavaScript SDK is required for the basic navigation flow.

## Usage Pattern

Construct a validated directions URL using the selected branch destination.

The destination should be derived from trusted branch coordinates/details.

## Best Practices

- Encode destination parameters.
- Validate coordinates before building the URL.
- Open navigation in a new browser/app context where appropriate.
- Keep the integration isolated in `src/lib/maps.ts`.

## Common Mistakes

- Embedding an unnecessary map.
- Passing unvalidated arbitrary URLs.
- Constructing URLs from unsafe unescaped input.

## Failure Modes

If navigation URL construction fails, keep the branch information visible and provide a safe fallback such as the branch address.

---

# 15. PDF Generation

## Purpose

PDF generation creates the pre-vetted routing slip for the citizen.

## Recommended Boundary

Keep PDF logic in:

```text
src/features/dossier/routing-slip.ts
```

## Usage Pattern

Generate the PDF from an already validated dossier/result model.

Do not allow arbitrary UI state to define policy values inside the PDF generator.

## Best Practices

- One-page layout.
- Prominent tracking code.
- Selected scheme.
- Selected branch.
- Relevant repayment summary.
- Minimal personal information.
- Required language support.
- Deterministic output.

## Common Mistakes

- Recalculating policy inside the PDF layer.
- Including unnecessary personal data.
- Generating a PDF from unvalidated form state.
- Allowing long translated text to break the layout.

## Failure Modes

PDF errors should produce a recoverable UI error without invalidating the user's eligibility result.

---

# 16. QR Code Library

## Purpose

A QR library may be used to encode the approved CrediX tracking reference or safe retrieval target.

## Usage Pattern

The QR payload must be deliberately constructed.

```text
tracking reference
        ↓
approved safe payload
        ↓
QR generator
        ↓
routing slip
```

## Best Practices

- Encode only approved information.
- Never encode raw phone numbers or unnecessary personal data.
- Test scanning on real mobile devices.
- Keep QR generation deterministic.

## Common Mistakes

- Encoding the entire dossier JSON.
- Encoding secrets.
- Encoding raw PII.
- Creating a QR that points to an untrusted arbitrary URL.

## Failure Modes

If QR generation fails, the tracking code must remain visible as plain text.

---

# 17. Testing Libraries

## Purpose

The project should use a lightweight testing stack appropriate for React/Vite.

Recommended categories:
- unit tests for domain logic
- component tests for important UI workflows
- integration tests for database/provider boundaries where practical

A specific test runner should be selected during project initialization and documented in `package.json` and the final implementation.

## Required Coverage

At minimum, test:
- eligibility
- ranking
- funding
- EMI
- moratorium
- branch filtering
- NPA killswitch
- quota filtering
- tracking code generation
- important intake validation

## Best Practices

Test behavior, not implementation details.

Good:

```ts
it("excludes a branch with NPA above the policy threshold", () => {});
```

Avoid tests that merely assert internal function structure.

---

# 18. Dependency Management

## Rules

1. Add a dependency only when it solves a real project requirement.
2. Prefer established libraries already aligned with the architecture.
3. Avoid duplicate libraries serving the same purpose.
4. Pin or lock dependency versions through the package lockfile.
5. Review security advisories before production releases.
6. Remove unused dependencies.

## Adding a New Library

Before adding a dependency, document:
- purpose
- why existing project code cannot solve it
- bundle/runtime impact
- security implications
- maintenance quality
- testing impact

---

# 19. Recommended Library Boundary Map

```text
React
  → UI rendering

Vite
  → build and development

TypeScript
  → static typing

Tailwind
  → styling

i18next + react-i18next
  → localization

Supabase JS
  → database/backend access

PostgreSQL
  → authoritative relational storage

PostGIS
  → geographic filtering

Service Worker / PWA tooling
  → offline application shell

Browser Geolocation
  → citizen location capture

Bhashini
  → optional speech-to-text

Google Maps intent URL
  → branch navigation

PDF library
  → routing slip generation

QR library
  → safe tracking reference
```

---

# 20. Provider Abstraction Rule

Third-party libraries and providers must not become the application's domain model.

The preferred boundary is:

```text
Provider SDK/API
      ↓
Provider adapter
      ↓
CrediX domain type
      ↓
Feature logic
      ↓
UI
```

For example:

```text
Bhashini response
      ↓
bhashini.ts
      ↓
TranscriptionResult
      ↓
Voice feature
      ↓
Intake field
```

This allows the provider to change without rewriting the entire application.

---

# 21. Upgrade Policy

Do not upgrade a major dependency while implementing an unrelated feature.

Dependency upgrades should be isolated, tested, and documented.

After an upgrade:
1. install cleanly
2. run type checks
3. run lint
4. run tests
5. run production build
6. verify critical user flows

---

# 22. Library Decision Rule for AI Agents

An AI coding agent must not install a new library simply because it is convenient.

Before adding one, the agent must check:
1. `package.json`
2. `library_docs.md`
3. existing utilities
4. existing components
5. architecture constraints

If the requirement can be satisfied cleanly with existing dependencies, do not add another dependency.


## Animation Libraries

CrediX uses a layered motion strategy. Animation must improve clarity and perceived quality without slowing the citizen workflow.

### Animation Selection Hierarchy

Use the simplest appropriate technology:

1. **CSS/Tailwind transitions** — simple hover, focus, color, opacity, transform, and state changes.
2. **Framer Motion** — React component transitions, page transitions, card entrances/exits, drawers, modals, and interactive micro-interactions.
3. **GSAP** — complex timelines, choreographed sequences, advanced transforms, or animation that requires fine-grained timeline control.
4. Do not add another animation library unless there is a demonstrated requirement and the architecture documentation is updated.

Do not use GSAP and Framer Motion for the same animation unless there is a specific technical reason.

### Framer Motion

**Purpose**
- React component animation.
- Intake card transitions.
- Result-section reveals.
- Modal and drawer transitions.
- Shared UI micro-interactions.
- Page/route transitions where appropriate.

**Installation**

```bash
npm install framer-motion
```

**Usage**

Prefer reusable variants:

```ts
export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
};
```

Keep shared variants in the UI/motion layer rather than duplicating them inside feature components.

**Best practices**
- Keep animations short and purposeful.
- Prefer transform and opacity.
- Animate reusable UI boundaries instead of individual text nodes unnecessarily.
- Respect `prefers-reduced-motion`.
- Never delay critical actions or financial information.
- Keep animation state separate from domain state.

**Common mistakes**
- Creating unique transition values in every component.
- Animating layout properties unnecessarily.
- Using motion to hide server/API latency.
- Making users wait for an entrance animation before interaction.

### GSAP

**Purpose**
- Complex timeline choreography.
- Advanced coordinated transforms.
- Multi-step visual sequences that require explicit timeline control.

**Installation**

```bash
npm install gsap
```

**Usage**

GSAP must be isolated behind reusable UI animation utilities/hooks.

Example:

```ts
export function playIntroTimeline(element: HTMLElement) {
  return gsap.timeline()
    .from(element, { opacity: 0, y: 16, duration: 0.3 })
    .to(element, { opacity: 1, duration: 0.2 });
}
```

React lifecycle cleanup is mandatory.

**Best practices**
- Use GSAP only when timeline/control capabilities are justified.
- Prefer transform and opacity.
- Kill/revert timelines during cleanup.
- Keep GSAP out of business/domain services.
- Avoid expensive continuous animation on low-powered mobile devices.

**Common mistakes**
- Using GSAP for simple CSS transitions.
- Creating timelines directly inside large presentation components.
- Forgetting cleanup.
- Continuously animating layout-heavy properties.

### Motion Abstraction

Keep reusable motion definitions in a UI-layer location such as:

```text
src/lib/motion/
├── variants.ts
├── transitions.ts
├── reduced-motion.ts
└── gsap/
    ├── timelines.ts
    └── cleanup.ts
```

Adapt the exact path to the repository without violating the separation of UI motion from business logic.

### Reduced Motion

All non-essential animation must support:

```text
prefers-reduced-motion: reduce
```

When reduced motion is requested:
- remove decorative movement
- minimize transforms
- shorten or remove entrance animations
- preserve immediate access to content and actions

### Animation Testing

Verify animation on:
- desktop
- mobile
- slow devices
- reduced-motion mode
- keyboard interaction
- route changes
- component unmount/remount
- loading/error states

Animation must never cause layout instability or prevent interaction.
