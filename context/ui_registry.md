# CrediX — UI Registry

## 1. Purpose

This document is the living registry of reusable CrediX UI components.

Every component should have:
- a clear responsibility
- a stable path
- explicit props
- known dependencies
- consistent Tailwind usage
- a defined reuse intent
- a lifecycle status

The registry follows `ui_tokens.md` and `ui_rules.md`.

Status values:

```text
Planned
In Progress
Stable
Deprecated
```

A component should be marked `Stable` only after it is implemented, tested, accessible, responsive, and used successfully in the product.

---

# 2. Layout Components

## 2.1 AppShell

**Path:** `src/components/layout/AppShell.tsx`

**Props:**
```ts
interface AppShellProps {
  children: React.ReactNode;
}
```

**Dependencies:**
- React
- MenuButton

**Tailwind Classes:**
```text
min-h-screen
bg-background
text-foreground
```

**Reusability Intent:** Global application shell.

**Status:** Stable

**Rules:**
- owns page-level background
- provides global layout boundaries
- must not contain business logic

---

## 2.2 PageContainer

**Path:** `src/components/layout/PageContainer.tsx`

**Props:**
```ts
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}
```

**Dependencies:**
- React

**Tailwind Classes:**
```text
mx-auto
w-full
max-w-[1440px]
px-5
sm:px-8
lg:px-12
xl:px-16
```

**Reusability Intent:** Standard page content width.

**Status:** Stable

---

## 2.3 Section

**Path:** `src/components/layout/Section.tsx`

**Props:**
```ts
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}
```

**Dependencies:**
- React

**Tailwind Classes:**
```text
w-full
py-12
md:py-16
lg:py-24
```

**Reusability Intent:** Standard vertical page section.

**Status:** Stable

---

## 2.4 ResponsiveCardRail

**Path:** `src/components/layout/ResponsiveCardRail.tsx`

**Props:**
```ts
interface ResponsiveCardRailProps {
  children: React.ReactNode;
  activeIndex?: number;
  className?: string;
}
```

**Dependencies:**
- React
- IntakeCard

**Tailwind Classes:**
```text
flex
w-full
gap-4
overflow-x-auto
lg:overflow-visible
```

**Reusability Intent:** Controlled card composition for the intake experience.

**Status:** Planned

**Rules:**
- horizontal behavior must be intentional
- must not create page-level accidental overflow
- mobile touch scrolling must remain usable

---

# 3. Navigation Components

## 3.1 MenuButton

**Path:** `src/components/navigation/MenuButton.tsx`

**Props:**
```ts
interface MenuButtonProps {
  onClick: () => void;
  expanded: boolean;
  label: string;
}
```

**Dependencies:**
- React
- icon library selected by project

**Tailwind Classes:**
```text
inline-flex
items-center
gap-2
rounded-full
border
border-accent-border
bg-accent
px-5
py-3
text-foreground
```

**Reusability Intent:** Global navigation trigger.

**Status:** Stable

**Accessibility:**
- `aria-expanded`
- `aria-controls`
- keyboard activation
- visible focus

---

## 3.2 MenuPanel

**Path:** `src/components/navigation/MenuPanel.tsx`

**Props:**
```ts
interface MenuPanelProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```

**Dependencies:**
- React
- MenuButton

**Tailwind Classes:**
```text
absolute
right-0
z-dropdown
rounded-lg
border
border-accent-border
bg-background
```

**Reusability Intent:** Lightweight application menu.

**Status:** Planned

**Rules:**
- close on Escape
- trap focus only when appropriate
- do not become a permanent sidebar

---

## 3.3 LanguageSwitcher

**Path:** `src/components/navigation/LanguageSwitcher.tsx`

**Props:**
```ts
interface LanguageSwitcherProps {
  value: "en" | "hi";
  onChange: (language: "en" | "hi") => void;
}
```

**Dependencies:**
- react-i18next

**Tailwind Classes:**
```text
inline-flex
items-center
rounded-full
border
border-accent-border
bg-accent
```

**Reusability Intent:** Global English/Hindi switching.

**Status:** Stable

---

# 4. Form Components

## 4.1 FormField

**Path:** `src/components/common/FormField.tsx`

**Props:**
```ts
interface FormFieldProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}
```

**Dependencies:**
- React

**Tailwind Classes:**
```text
flex
flex-col
gap-2
```

**Reusability Intent:** Accessible form field wrapper.

**Status:** Stable

---

## 4.2 TextInput

**Path:** `src/components/common/TextInput.tsx`

**Props:**
```ts
interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}
```

**Dependencies:**
- React
- FormField where composed

**Tailwind Classes:**
```text
min-h-11
w-full
border-b
border-details-border
bg-transparent
text-foreground
outline-none
focus:border-accent-border
focus:ring-2
focus:ring-accent-border
```

**Reusability Intent:** Standard text entry.

**Status:** Stable

---

## 4.3 NumberInput

**Path:** `src/components/common/NumberInput.tsx`

**Props:**
```ts
interface NumberInputProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
  error?: string;
}
```

**Dependencies:**
- TextInput
- validation utilities

**Tailwind Classes:**
```text
min-h-11
w-full
bg-transparent
text-foreground
```

**Reusability Intent:** Validated numeric input.

**Status:** Planned

**Rules:**
- reject NaN
- reject Infinity
- validate bounds
- keep numeric state separate from display formatting

---

## 4.4 RangeSlider

**Path:** `src/components/common/RangeSlider.tsx`

**Props:**
```ts
interface RangeSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
  colorFamily: "purpose" | "amount" | "income" | "details";
}
```

**Dependencies:**
- React

**Tailwind Classes:**
```text
w-full
appearance-none
bg-transparent
```

**Reusability Intent:** Amount, income, and future numeric controls.

**Status:** Stable

**Rules:**
- minimum effective touch target: 44px
- keyboard accessible
- current value exposed through accessible labeling
- visual track remains minimal

---

## 4.5 RadioOption

**Path:** `src/components/common/RadioOption.tsx`

**Props:**
```ts
interface RadioOptionProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
}
```

**Dependencies:**
- React

**Tailwind Classes:**
```text
min-h-11
cursor-pointer
```

**Reusability Intent:** Purpose and gender selections.

**Status:** Stable

---

## 4.6 CheckboxField

**Path:** `src/components/common/CheckboxField.tsx`

**Props:**
```ts
interface CheckboxFieldProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  error?: string;
}
```

**Dependencies:**
- React

**Tailwind Classes:**
```text
min-h-11
inline-flex
items-start
gap-3
```

**Reusability Intent:** Declarations and explicit consent/confirmation controls.

**Status:** Stable

---

# 5. Button Components

## 5.1 Button

**Path:** `src/components/common/Button.tsx`

**Props:**
```ts
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
}
```

**Dependencies:**
- React

**Tailwind Classes:**
```text
inline-flex
min-h-11
items-center
justify-center
rounded-lg
px-5
py-3
font-medium
transition-colors
focus-visible:outline-2
focus-visible:outline-offset-2
focus-visible:outline-accent-border
```

**Reusability Intent:** Primary application button primitive.

**Status:** Stable

---

## 5.2 IconButton

**Path:** `src/components/common/IconButton.tsx`

**Props:**
```ts
interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}
```

**Dependencies:**
- Button

**Tailwind Classes:**
```text
inline-flex
size-11
items-center
justify-center
rounded-full
```

**Reusability Intent:** Compact icon actions.

**Status:** Stable

**Accessibility:** Visible or assistive label required.

---

## 5.3 NavigationButton

**Path:** `src/components/common/NavigationButton.tsx`

**Props:**
```ts
interface NavigationButtonProps {
  direction: "back" | "next";
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}
```

**Dependencies:**
- Button

**Tailwind Classes:**
```text
inline-flex
min-h-11
items-center
gap-2
```

**Reusability Intent:** Intake wizard navigation.

**Status:** Stable

---

# 6. Card Components

## 6.1 BaseCard

**Path:** `src/components/common/BaseCard.tsx`

**Props:**
```ts
interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  as?: "article" | "section" | "div";
}
```

**Dependencies:**
- React

**Tailwind Classes:**
```text
rounded-lg
border-[1.5px]
```

**Reusability Intent:** Generic border-driven card primitive.

**Status:** Stable

---

## 6.2 IntakeCard

**Path:** `src/components/common/IntakeCard.tsx`

**Props:**
```ts
interface IntakeCardProps {
  title: string;
  description?: string;
  family: "purpose" | "amount" | "income" | "details";
  active?: boolean;
  children: React.ReactNode;
}
```

**Dependencies:**
- BaseCard
- CrediX UI tokens

**Tailwind Classes:**
```text
min-h-[320px]
rounded-lg
border-[1.5px]
p-6
md:p-8
lg:p-10
```

**Reusability Intent:** Shared shell for all four intake cards.

**Status:** Stable

**Rules:**
- semantic color family is mandatory
- no arbitrary card colors
- active state must preserve family identity

---

## 6.3 PurposeCard

**Path:** `src/components/intake/PurposeCard.tsx`

**Props:**
```ts
interface PurposeCardProps {
  value: IntakePurpose | null;
  options: PurposeOption[];
  onChange: (purpose: IntakePurpose) => void;
}
```

**Dependencies:**
- IntakeCard
- RadioOption
- i18next

**Tailwind Classes:**
```text
bg-purpose-surface
border-purpose-border
text-purpose-foreground
```

**Reusability Intent:** Purpose selection step.

**Status:** Stable

---

## 6.4 AmountCard

**Path:** `src/components/intake/AmountCard.tsx`

**Props:**
```ts
interface AmountCardProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  assistanceText?: string;
}
```

**Dependencies:**
- IntakeCard
- RangeSlider
- currency formatter

**Tailwind Classes:**
```text
bg-amount-surface
border-amount-border
text-amount-foreground
```

**Reusability Intent:** Project/loan amount input.

**Status:** Stable

---

## 6.5 IncomeCard

**Path:** `src/components/intake/IncomeCard.tsx`

**Props:**
```ts
interface IncomeCardProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  policyHint?: string;
}
```

**Dependencies:**
- IntakeCard
- RangeSlider
- currency formatter

**Tailwind Classes:**
```text
bg-income-surface
border-income-border
text-income-foreground
```

**Reusability Intent:** Annual family income input.

**Status:** Stable

---

## 6.6 DetailsCard

**Path:** `src/components/intake/DetailsCard.tsx`

**Props:**
```ts
interface DetailsCardProps {
  name: string;
  gender: Gender | null;
  scDeclared: boolean;
  onNameChange: (value: string) => void;
  onGenderChange: (value: Gender) => void;
  onScDeclaredChange: (value: boolean) => void;
}
```

**Dependencies:**
- IntakeCard
- TextInput
- RadioOption
- CheckboxField

**Tailwind Classes:**
```text
bg-details-surface
border-details-border
text-details-foreground
```

**Reusability Intent:** Final intake step.

**Status:** Stable

---

# 7. Input/Interaction Components

## 7.1 IntakeWizard

**Path:** `src/components/intake/IntakeWizard.tsx`

**Props:**
```ts
interface IntakeWizardProps {
  initialStep?: IntakeStep;
  onComplete: (input: IntakeForm) => void;
}
```

**Dependencies:**
- PurposeCard
- AmountCard
- IncomeCard
- DetailsCard
- IntakeProgress
- NavigationButton
- intake store

**Tailwind Classes:**
```text
w-full
```

**Reusability Intent:** Complete four-step intake orchestration.

**Status:** Stable

**Rules:**
- owns navigation state
- delegates business decisions to feature logic
- must not calculate eligibility itself

---

## 7.2 IntakeProgress

**Path:** `src/components/intake/IntakeProgress.tsx`

**Props:**
```ts
interface IntakeProgressProps {
  currentStep: number;
  totalSteps: number;
}
```

**Dependencies:**
- i18next

**Tailwind Classes:**
```text
text-center
```

**Reusability Intent:** "Loan Ready in X Clicks" progress message.

**Status:** Stable

---

## 7.3 VoiceInputButton

**Path:** `src/components/intake/VoiceInputButton.tsx`

**Props:**
```ts
interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  fieldLabel: string;
}
```

**Dependencies:**
- voice feature adapter
- Button
- i18next

**Tailwind Classes:**
```text
inline-flex
min-h-11
items-center
gap-2
```

**Reusability Intent:** Optional Bhashini-powered voice entry.

**Status:** Planned

---

# 8. Results Components

## 8.1 ResultsHeader

**Path:** `src/components/results/ResultsHeader.tsx`

**Props:**
```ts
interface ResultsHeaderProps {
  title: string;
  subtitle?: string;
}
```

**Dependencies:**
- i18next

**Tailwind Classes:**
```text
space-y-2
```

**Reusability Intent:** Results page heading.

**Status:** Stable

---

## 8.2 PrimarySchemeCard

**Path:** `src/components/results/PrimarySchemeCard.tsx`

**Props:**
```ts
interface PrimarySchemeCardProps {
  scheme: Scheme;
  eligibility: EligibilityResult;
  onContinue: () => void;
}
```

**Dependencies:**
- BaseCard
- Button
- localized scheme metadata

**Tailwind Classes:**
```text
rounded-lg
border-[1.5px]
bg-accent
```

**Reusability Intent:** Primary recommendation display.

**Status:** Stable

**Rules:**
- must visually dominate alternatives
- must not invent policy values
- receives authoritative scheme data

---

## 8.3 EligibilityExplanation

**Path:** `src/components/results/EligibilityExplanation.tsx`

**Props:**
```ts
interface EligibilityExplanationProps {
  reasons: EligibilityReason[];
}
```

**Dependencies:**
- i18next
- reason-code translation map

**Tailwind Classes:**
```text
space-y-2
text-sm
```

**Reusability Intent:** Human-readable deterministic eligibility explanation.

**Status:** Stable

---

## 8.4 AlternativeSchemes

**Path:** `src/components/results/AlternativeSchemes.tsx`

**Props:**
```ts
interface AlternativeSchemesProps {
  schemes: Scheme[];
  onSelect?: (schemeId: string) => void;
}
```

**Dependencies:**
- BaseCard
- i18next

**Tailwind Classes:**
```text
grid
gap-4
md:grid-cols-2
```

**Reusability Intent:** Secondary eligible scheme list.

**Status:** Stable

---

## 8.5 NoMatchState

**Path:** `src/components/results/NoMatchState.tsx`

**Props:**
```ts
interface NoMatchStateProps {
  reasons: EligibilityReason[];
  onRetry?: () => void;
}
```

**Dependencies:**
- BaseCard
- Button
- i18next

**Tailwind Classes:**
```text
rounded-lg
border
border-error
bg-error-surface
```

**Reusability Intent:** Deterministic no-match experience.

**Status:** Stable

---

# 9. Repayment Components

## 9.1 FundingBreakdown

**Path:** `src/components/repayment/FundingBreakdown.tsx`

**Props:**
```ts
interface FundingBreakdownProps {
  projectCost: number;
  governmentFunding: number;
  promoterContribution: number;
}
```

**Dependencies:**
- currency formatter
- BaseCard

**Tailwind Classes:**
```text
grid
gap-4
sm:grid-cols-3
```

**Reusability Intent:** Financial contribution summary.

**Status:** Stable

---

## 9.2 MoratoriumController

**Path:** `src/components/repayment/MoratoriumController.tsx`

**Props:**
```ts
interface MoratoriumControllerProps {
  value: number;
  min: number;
  max: number;
  onChange: (months: number) => void;
}
```

**Dependencies:**
- RangeSlider
- i18next

**Tailwind Classes:**
```text
space-y-3
```

**Reusability Intent:** Scheme-constrained moratorium selection.

**Status:** Stable

---

## 9.3 EMIHighlight

**Path:** `src/components/repayment/EMIHighlight.tsx`

**Props:**
```ts
interface EMIHighlightProps {
  monthlyEmi: number;
  interestRate: number;
}
```

**Dependencies:**
- currency formatter

**Tailwind Classes:**
```text
rounded-lg
bg-accent
p-6
text-center
```

**Reusability Intent:** Primary repayment output.

**Status:** Stable

---

## 9.4 RepaymentSchedule

**Path:** `src/components/repayment/RepaymentSchedule.tsx`

**Props:**
```ts
interface RepaymentScheduleProps {
  schedule: RepaymentScheduleRow[];
  moratoriumMonths: number;
}
```

**Dependencies:**
- responsive table/list primitives
- currency formatter
- i18next

**Tailwind Classes:**
```text
w-full
overflow-hidden
rounded-lg
border
```

**Reusability Intent:** Phase 1/Phase 2 repayment presentation.

**Status:** Stable

---

# 10. Branch Components

## 10.1 BranchCard

**Path:** `src/components/branch/BranchCard.tsx`

**Props:**
```ts
interface BranchCardProps {
  branch: RoutedBranch;
  distanceKm: number;
  onDirections: () => void;
}
```

**Dependencies:**
- BaseCard
- Button
- Google Maps URL utility

**Tailwind Classes:**
```text
rounded-lg
border
bg-background
p-5
```

**Reusability Intent:** Recommended branch display.

**Status:** Stable

---

## 10.2 BranchSearch

**Path:** `src/components/branch/BranchSearch.tsx`

**Props:**
```ts
interface BranchSearchProps {
  onLocationRequest: () => void;
  loading?: boolean;
  error?: string;
}
```

**Dependencies:**
- Button
- location feature
- i18next

**Tailwind Classes:**
```text
space-y-4
```

**Reusability Intent:** Location and branch-routing entry point.

**Status:** Stable

---

## 10.3 BranchHealthBadge

**Path:** `src/components/branch/BranchHealthBadge.tsx`

**Props:**
```ts
interface BranchHealthBadgeProps {
  status: "viable" | "limited" | "unavailable";
}
```

**Dependencies:**
- i18next

**Tailwind Classes:**
```text
inline-flex
rounded-full
px-3
py-1
text-sm
```

**Reusability Intent:** Compact partner-health communication.

**Status:** Planned

**Rules:**
- must not expose internal scoring unnecessarily
- status must never rely only on color

---

## 10.4 RoutingSlipButton

**Path:** `src/components/branch/RoutingSlipButton.tsx`

**Props:**
```ts
interface RoutingSlipButtonProps {
  dossier: LoanDossier;
  loading?: boolean;
  onGenerate: () => void;
}
```

**Dependencies:**
- Button
- routing-slip feature

**Tailwind Classes:**
```text
inline-flex
min-h-11
items-center
gap-2
```

**Reusability Intent:** Generate/print routing slip.

**Status:** Stable

---

# 11. Analytics Components

## 11.1 EligibilitySummary

**Path:** `src/components/analytics/EligibilitySummary.tsx`

**Props:**
```ts
interface EligibilitySummaryProps {
  eligibleCount: number;
  primaryScheme?: Scheme;
}
```

**Dependencies:**
- i18next

**Tailwind Classes:**
```text
grid
gap-4
```

**Reusability Intent:** Internal/administrative summary if analytics views are later exposed.

**Status:** Planned

---

## 11.2 RoutingMetrics

**Path:** `src/components/analytics/RoutingMetrics.tsx`

**Props:**
```ts
interface RoutingMetricsProps {
  viableBranches: number;
  excludedBranches: number;
}
```

**Dependencies:**
- i18next

**Tailwind Classes:**
```text
grid
gap-4
sm:grid-cols-2
```

**Reusability Intent:** Operational metrics presentation.

**Status:** Planned

---

# 12. Utility Components

## 12.1 LoadingState

**Path:** `src/components/common/LoadingState.tsx`

**Props:**
```ts
interface LoadingStateProps {
  label: string;
  compact?: boolean;
}
```

**Dependencies:**
- i18next

**Tailwind Classes:**
```text
inline-flex
items-center
gap-2
```

**Reusability Intent:** Standard loading feedback.

**Status:** Stable

---

## 12.2 ErrorState

**Path:** `src/components/common/ErrorState.tsx`

**Props:**
```ts
interface ErrorStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

**Dependencies:**
- BaseCard
- Button

**Tailwind Classes:**
```text
rounded-lg
border
border-error
bg-error-surface
text-error
```

**Reusability Intent:** Standard recoverable error UI.

**Status:** Stable

---

## 12.3 EmptyState

**Path:** `src/components/common/EmptyState.tsx`

**Props:**
```ts
interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

**Dependencies:**
- BaseCard
- Button

**Tailwind Classes:**
```text
rounded-lg
border
border-border
bg-background
p-6
```

**Reusability Intent:** Standard empty result presentation.

**Status:** Stable

---

## 12.4 StatusBadge

**Path:** `src/components/common/StatusBadge.tsx`

**Props:**
```ts
interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info";
  label: string;
}
```

**Dependencies:**
- UI tokens

**Tailwind Classes:**
```text
inline-flex
rounded-full
px-3
py-1
text-sm
font-medium
```

**Reusability Intent:** Semantic status communication.

**Status:** Stable

---

## 12.5 CurrencyValue

**Path:** `src/components/common/CurrencyValue.tsx`

**Props:**
```ts
interface CurrencyValueProps {
  amount: number;
  size?: "sm" | "md" | "lg" | "display";
  showSymbol?: boolean;
}
```

**Dependencies:**
- Indian currency formatter

**Tailwind Classes:**
```text
tabular-nums
```

**Reusability Intent:** Consistent financial display.

**Status:** Stable

**Rules:**
- formatting only
- never performs business calculations

---

## 12.6 ProgressAnnouncement

**Path:** `src/components/common/ProgressAnnouncement.tsx`

**Props:**
```ts
interface ProgressAnnouncementProps {
  message: string;
}
```

**Dependencies:**
- React

**Tailwind Classes:**
```text
sr-only
```

**Reusability Intent:** Accessible announcement of important dynamic state.

**Status:** Planned

---

# 13. Component Dependency Principles

The preferred dependency direction is:

```text
Page
  ↓
Feature Components
  ↓
Reusable UI Components
  ↓
Primitive UI
```

Feature logic remains separate:

```text
Feature Component
      ↓
Feature Hook / Action
      ↓
Domain Function
      ↓
Database / Provider Boundary
```

UI components must not directly depend on raw database tables.

---

# 14. Component Status Rules

## Stable

A component is `Stable` when:
- implemented
- typed
- responsive
- accessible
- localized where applicable
- tested
- documented
- reused or clearly reusable

## In Progress

Use while actively implementing a component.

## Planned

Use when the component is defined but not implemented.

## Deprecated

Use when an existing component should no longer receive new usage.

Deprecated components should include a migration path in the relevant feature work.

---

# 15. Reuse Rules

Before creating a component:

```text
1. Search this registry.
2. Search src/components.
3. Search the active feature directory.
4. Reuse or extend an existing component if appropriate.
5. Add the new component to this registry.
```

Do not duplicate components with slightly different names.

---

# 16. Tailwind Rules

Components should use semantic token classes.

Preferred:

```text
bg-purpose-surface
border-purpose-border
text-purpose-foreground
```

Avoid:

```text
bg-[#e8ebff]
border-[#899bff]
text-[#899bff]
```

The raw color values belong in the token layer.

---

# 17. Component Accessibility Requirements

Every interactive component must define:
- keyboard behavior
- focus behavior
- accessible name
- selected/expanded state where applicable
- disabled behavior
- loading behavior where applicable

Interactive cards must not rely solely on mouse click handlers.

---

# 18. Localization Requirements

Any component containing citizen-facing text must use i18next/react-i18next.

Examples include:
- buttons
- card headings
- helper text
- validation
- empty states
- errors
- branch actions
- repayment labels
- progress messages

Database codes must be mapped to localized labels before presentation.

---

# 19. Mobile Requirements

Every component must be tested at narrow viewport widths.

Minimum expectations:
- no unintended horizontal overflow
- touch targets around 44px
- readable text
- no clipped controls
- usable sliders
- usable cards
- accessible navigation

---

# 20. Forbidden Component Patterns

Do not create:
- business-logic components
- database-aware presentation components
- components with hardcoded scheme policy
- duplicate buttons
- duplicate card systems
- arbitrary color variants
- inaccessible custom controls
- components that silently swallow errors
- giant components that own unrelated workflows

---

# 21. Registry Maintenance

Whenever a component is added, removed, renamed, or materially redesigned:

1. Update this registry.
2. Update affected imports.
3. Update `ui_rules.md` if behavior changes.
4. Update `ui_tokens.md` if a new token is required.
5. Update `build_plan.md` if the change belongs to a planned feature.

This file must remain synchronized with the actual component tree.
