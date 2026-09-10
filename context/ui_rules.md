# CrediX — UI Rules

## 1. Purpose

This document converts the CrediX visual tokens and supplied UI references into implementation rules.

It defines how the interface should behave, not just how it should look.

The experience must remain:
- minimal
- warm
- editorial
- playful without becoming childish
- highly readable
- mobile-first
- low-friction
- visually distinct from a conventional banking dashboard

The four intake concepts must remain visually recognizable:

```text
Purpose → Lavender
Amount  → Lime
Income  → Pink
Details → Warm Beige
```

---

# 2. Global Layout

## 2.1 Application Canvas

The entire application uses:

```text
Background: #fbf7ef
```

Do not use pure white as the primary application background.

The background should create generous negative space around the main content.

---

## 2.2 Page Width

Use a centered responsive content container.

Recommended maximum width:

```text
max-width: 1440px
```

The interface may use wider compositions on large screens when the design intentionally displays adjacent cards.

Do not force every page into a narrow dashboard container.

---

## 2.3 Page Padding

Desktop:

```text
48px–64px horizontal
```

Tablet:

```text
32px–40px horizontal
```

Mobile:

```text
20px–24px horizontal
```

Vertical spacing should remain generous.

---

# 3. Navigation Rules

## 3.1 Menu Position

The primary menu control appears in the top-right area of the application.

Reference treatment:

```text
+ Menu
```

Use:
- pill radius
- lavender surface
- lavender border
- dark text
- clear horizontal icon/text alignment

Recommended:

```text
background: #e8ebff
border: #899bff
color: #111111
border-radius: 9999px
```

---

## 3.2 Menu Behavior

The menu must:
- be keyboard accessible
- expose an accessible name
- have a visible focus state
- open without shifting the main layout unexpectedly
- close on Escape
- close when focus is moved outside where appropriate
- remain usable on mobile

The menu should not become a large permanent navigation sidebar unless the product requirements explicitly change.

---

# 4. Hero Rules

## 4.1 Landing Message

The primary landing experience uses a large editorial greeting.

Visual hierarchy:

```text
Welcome,

What are we funding today?
```

The key action word may be emphasized using:
- lavender
- italic styling
- increased weight

Example:

```text
What are we funding today?
             ^^^^^^^
```

Do not over-style the entire sentence.

---

## 4.2 Hero Spacing

The hero should have substantial vertical breathing room.

Desktop:

```text
Top spacing: approximately 80px+
Bottom spacing: approximately 64px+
```

Mobile:

```text
Top spacing: approximately 48px+
Bottom spacing: approximately 40px+
```

The exact values may adapt to viewport height.

---

# 5. Progress Message

The intake experience communicates the number of remaining actions.

Examples:

```text
Loan Ready in 4 Clicks
Loan Ready in 3 more Clicks
Loan Ready in 2 more Clicks
Loan Ready in 1 more Click
```

## Rules

- The number must come from actual wizard state.
- Do not hardcode the number.
- The number receives stronger visual emphasis.
- The surrounding text remains visually quiet.
- Singular/plural wording must be localized.
- The progress statement must remain understandable when translated.

The number should use the current/active card's semantic color when appropriate.

---

# 6. Intake Architecture

The intake flow consists of four conceptual cards:

```text
01 Purpose
02 Amount
03 Income
04 Details
```

Each card represents one meaningful citizen decision.

Do not turn these into a long traditional multi-field form.

---

# 7. Desktop Intake Composition

On desktop, the intake experience may use a horizontal composition where:
- the active card is visually dominant
- neighboring cards can remain partially visible
- the active step is easy to understand
- the user sees the overall journey

The supplied references intentionally use a large active card with neighboring content entering from the sides.

Do not interpret the partial cards as accidental overflow.

If horizontal presentation is used, it must be deliberate and controlled.

---

# 8. Mobile Intake Composition

The mobile reference demonstrates a vertically spacious layout with the intake cards adapted to the narrow viewport.

Rules:
- no accidental horizontal page scrolling
- active card receives the main visual focus
- card content remains readable
- controls remain comfortably tappable
- heading sizes reduce responsively
- decorative whitespace may remain generous

A horizontal carousel may be used if implemented deliberately, but the viewport itself must never become horizontally scrollable because of a layout bug.

---

# 9. Card Rules

## 9.1 General Card Appearance

Cards use:
- solid semantic surface color
- visible semantic border
- modest corner radius
- minimal/no shadow
- large internal padding
- large typography
- generous whitespace

Recommended:

```text
Border: 1.5px–2px
Radius: 8px–12px
Shadow: none by default
```

---

## 9.2 Card Color Identity

### Purpose

```text
Surface: #e8ebff
Border: #899bff
Foreground: #899bff
```

### Amount

```text
Surface: #caeb65
Border: #316045
Foreground: #316045
```

### Income

```text
Surface: #f5b2bd
Border: #642731
Foreground: #642731
```

### Details

```text
Surface: #ebe3d4
Border: #c3b591
Foreground: #5f594d
```

Never swap these semantic identities.

---

# 10. Purpose Card

## Purpose

The Purpose card asks:

```text
What do you need the funds for?
```

## Visual Behavior

Use lavender as the complete card surface.

The card should have:
- large "Purpose" heading
- italic supporting question
- large, simple option labels
- strong selected state

Potential choices may include the purpose categories defined by the product.

## Selection

Selected purpose:
- receives strong foreground emphasis
- remains within lavender palette
- should be obvious without relying only on color

Unselected choices should remain readable but visually quieter.

---

# 11. Amount Card

## Purpose

The Amount card asks:

```text
How much money do you need?
```

## Visual Behavior

Use:

```text
Surface: #caeb65
Foreground: #316045
Border: #316045
```

The amount value should be the dominant element.

Example:

```text
50,000
```

The value should be:
- large
- centered or compositionally prominent
- easy to scan
- formatted for Indian numbering

Example:

```text
₹50,000
```

---

## 11.1 Amount Slider

The slider is intentionally minimal.

Use:
- thin visible track
- large enough invisible/touch interaction area
- semantic dark-green track
- outlined circular thumb

Do not use a generic browser-looking slider with heavy gradients or unnecessary decorations.

The slider must:
- work with mouse
- work with touch
- work with keyboard
- expose its current value to assistive technology

---

## 11.2 Amount Supporting Text

Supporting information such as:

```text
Govt assistance covers up to 90%
```

should appear as secondary italic text near the lower part of the card.

Do not make supporting text compete with the amount value.

---

# 12. Income Card

## Purpose

The Income card asks:

```text
What is your annual family income?
```

Use:

```text
Surface: #f5b2bd
Foreground: #642731
Border: #642731
```

The income amount should receive large visual emphasis.

Example:

```text
30,000
```

Use Indian number formatting.

---

## 12.1 Income Slider

The slider follows the same interaction model as the Amount slider.

Use:
- burgundy track
- pink surface
- pink/outlined thumb
- accessible keyboard interaction

Do not create a separate visual slider design.

---

## 12.2 Income Policy Hint

A scheme-related income limit may be communicated near the bottom of the card.

Example style:

```text
Must be under ₹5.00 Lakhs under scheme rules
```

Rules:
- make it supporting text
- keep it localized
- do not hardcode the displayed threshold
- derive policy values from authoritative scheme data when displayed as a rule
- do not imply eligibility until the eligibility engine has evaluated the full intake

---

# 13. Details Card

## Purpose

The Details card collects only basic applicant information.

Reference content includes:
- name
- gender
- SC declaration

Use the warm beige palette.

```text
Surface: #ebe3d4
Border: #c3b591
Foreground: #5f594d
```

---

## 13.1 Details Layout

The card should feel calm and simple.

Avoid:
- dense form grids
- unnecessary labels everywhere
- enterprise-style field panels
- excessive helper text

Use large readable inputs and clear selection controls.

---

## 13.2 Gender Selection

Gender selection must be:
- keyboard accessible
- visibly selected
- localized
- easy to understand

Do not use italics as the only selected-state indicator.

---

## 13.3 SC Declaration

The declaration should be explicit and understandable.

Do not hide it inside an ambiguous checkbox label.

The user must clearly understand that the eligibility workflow is intended for the relevant Scheduled Caste beneficiary context.

---

# 14. Buttons

## 14.1 Primary Buttons

Primary actions should feel simple and direct.

Use:
- strong semantic surface where appropriate
- clear foreground
- modest radius
- visible focus
- no excessive shadow

Avoid overly rounded "pill" buttons for every action.

Pill treatment is reserved for controls such as the top-right Menu where the reference design uses it.

---

## 14.2 Button States

Every button requires:

```text
default
hover
active
focus
disabled
loading
```

Loading buttons must not cause layout shifts.

Disabled buttons must remain readable.

---

# 15. Inputs

Inputs should visually belong to their surrounding card.

Rules:
- avoid unrelated white boxes unless required for contrast
- use semantic borders
- maintain strong focus
- keep input height touch-friendly
- use localized placeholders only when necessary
- prefer visible labels for important fields

Placeholder text must not replace an accessible label.

---

# 16. Cards as Interactive Controls

If a complete card is clickable:
- use a semantic button/link pattern where appropriate
- provide keyboard interaction
- provide selected state
- expose the state to assistive technology
- keep the visual identity of the card

Do not use:

```tsx
<div onClick={selectCard}>
```

as the only interaction mechanism.

---

# 17. Loading States

Loading states should preserve the layout.

For intake calculation:
- do not replace the entire screen with a generic spinner
- preserve the card/result structure
- communicate that the result is being calculated

For external services:
- Bhashini: show listening/transcribing
- routing: show location/branch search state
- dossier creation: show save/generation state
- PDF: show generation state

---

# 18. Empty States

An empty state must explain:
1. what is unavailable
2. why it may have happened when useful
3. what the user can do next

Example:

```text
No suitable branch found nearby.

You can try again with location enabled or contact a participating
channel partner.
```

Do not display a blank card.

---

# 19. Error States

Errors must be:
- human-readable
- localized
- actionable where possible
- visually distinct
- accessible

Never display:
- stack traces
- SQL errors
- provider error payloads
- internal exception messages

Use the CrediX semantic error palette:

```text
Error surface: #f5b2bd
Error foreground: #642731
```

---

# 20. Eligibility Result Rules

The results screen should make the primary recommendation obvious.

Hierarchy:

```text
Primary recommendation
        ↓
Why it fits
        ↓
Financial summary
        ↓
Alternative eligible schemes
        ↓
Next action
```

The primary result must not be visually buried under secondary information.

---

# 21. No-Match Eligibility State

If no scheme qualifies:
- clearly state that no matching scheme was found
- explain the major reason(s) where supported
- do not fabricate a recommendation
- do not imply approval
- offer a useful next step where available

Never replace a deterministic no-match result with an AI-generated guess.

---

# 22. Repayment UI Rules

The repayment section should communicate:

```text
Project cost
Government funding
Promoter contribution
Interest rate
Moratorium
Active repayment tenure
Estimated EMI
```

Financial values must be visually structured.

The EMI should be the primary numeric output.

---

# 23. Moratorium Slider

The moratorium control must:
- use the scheme's actual minimum
- use the scheme's actual maximum
- update calculations immediately
- expose current value accessibly
- remain keyboard operable

Do not allow the UI to select a value outside authoritative scheme limits.

---

# 24. Repayment Schedule

The schedule should distinguish:
- moratorium/grace period
- active amortization period

Use clear visual grouping.

Do not overwhelm the citizen with a large institutional amortization table on mobile.

Mobile may use:
- expandable rows
- compact cards
- summary + details pattern

---

# 25. Branch Recommendation Rules

The recommended branch must be based on authoritative routing logic.

Display:
- branch name
- bank/channel partner
- distance
- relevant contact/nodal information
- current viability information where appropriate

Do not expose branches that failed:
- geographic radius
- frozen status
- NPA killswitch
- quota availability

---

# 26. Location Permission Rules

Do not request location immediately when the user lands on the application.

Request it when branch routing becomes relevant.

Before requesting:

```text
Explain why location is needed.
```

If denied:

```text
Do not block the entire result experience.
```

Provide a fallback path appropriate to the product.

---

# 27. Google Maps Rules

The branch navigation action should open a Google Maps directions intent.

The UI should present a simple action such as:

```text
Get Directions
```

Do not embed a large map when the only requirement is navigation.

---

# 28. Routing Slip Rules

The routing slip must be:
- one page where practical
- easy to print
- easy to read
- bilingual when required
- based on validated data
- minimal in personal information

The tracking code should be prominent.

QR code content must never contain unnecessary raw PII.

---

# 29. Responsive Rules

## Desktop

At `≥1024px`:
- use generous whitespace
- allow large card compositions
- maintain large headings
- support adjacent/partially visible cards when intentionally designed
- preserve the editorial character

## Tablet

At `768px–1023px`:
- reduce card width and typography
- preserve clear step hierarchy
- avoid cramped three-card layouts

## Mobile

Below `640px`:
- use one primary active card at a time
- reduce display typography
- preserve large touch targets
- maintain 20–24px page padding
- avoid accidental horizontal overflow
- allow cards to become taller if necessary

---

# 30. Touch Targets

Interactive controls should have a minimum effective target around:

```text
44px × 44px
```

This applies even when the visible control is visually smaller.

Especially important for:
- slider thumbs
- menu
- navigation buttons
- card selectors
- checkboxes/radios
- close buttons

---

# 31. Accessibility Rules

## Keyboard

All workflows must be completable without a mouse.

Required:
- Tab navigation
- Shift+Tab navigation
- Enter/Space activation where appropriate
- Escape for dismissible overlays
- arrow-key slider operation

## Screen Readers

Provide:
- semantic headings
- labels
- button names
- status announcements
- accessible error descriptions

## Color

Color must never be the only indicator of:
- selection
- error
- success
- eligibility
- branch viability

---

# 32. Focus Rules

Use a visible lavender focus treatment.

Recommended:

```text
outline: 2px solid #899bff
outline-offset: 2px
```

Focus must remain visible against all four card surfaces.

---

# 33. Motion Rules

Use motion to explain state changes.

Appropriate:
- card transitions
- step changes
- menu opening
- slider feedback
- result appearance

Avoid:
- decorative animations that delay interaction
- continuous motion
- excessive bounce
- large parallax effects

Respect `prefers-reduced-motion`.

---

# 34. Dark Mode

The supplied visual direction is defined around the warm light canvas.

Dark mode should not be introduced as an automatic browser-driven inversion.

If dark mode is added later:
- create explicit dark semantic tokens
- preserve the four-card conceptual identities
- verify contrast independently
- do not simply invert the palette

Until dark mode is explicitly implemented, the light CrediX system is canonical.

---

# 35. Localization Rules

Every citizen-facing string must be translatable.

Do not write:

```tsx
<h1>Welcome</h1>
```

Use:

```tsx
<h1>{t("home.welcome")}</h1>
```

Translations must support:
- English
- Hindi

Hindi layouts must be tested for:
- text wrapping
- button width
- card height
- line height
- PDF rendering

Never assume English text length.

---

# 36. Financial Display Rules

Use Indian number formatting.

Examples:

```text
₹50,000
₹1,50,000
₹5,00,000
```

Financial values must:
- use appropriate currency formatting
- remain readable on mobile
- avoid unnecessary decimal precision in citizen-facing output

Calculation state must remain numeric.

---

# 37. Privacy Rules in UI

Do not display or persist unnecessary sensitive information.

The UI should avoid requesting information that is not required for the CrediX workflow.

When a tracking reference is sufficient, do not expose internal database identifiers.

Never display secrets.

---

# 38. PWA Rules

Offline behavior must be honest.

Allowed offline experience:
- application shell
- previously loaded static resources
- locally saved intake draft

Not allowed:
- presenting stale branch health as current
- claiming a live eligibility/routing decision when the authoritative service was unavailable
- pretending a dossier was saved when it was not

---

# 39. AI and UI Rules

AI must not generate or alter:
- eligibility decisions
- scheme limits
- interest rates
- funding percentages
- promoter margins
- EMI values
- NPA policy
- branch viability
- quota decisions

The UI may explain deterministic results in natural language only when the underlying facts are already known.

---

# 40. Visual Consistency Rules

Every new component must answer:

1. Which existing token does it use?
2. Which semantic color family does it belong to?
3. Does it reuse an existing component?
4. Does it work on mobile?
5. Does it have keyboard/focus behavior?
6. Is every visible string localized?
7. Does it introduce a new visual pattern unnecessarily?

If a component cannot answer these questions, it should not be merged without updating the design system.

---

# 41. Forbidden UI Patterns

Do not introduce:

- generic banking dashboard styling
- gradients across intake cards
- excessive drop shadows
- random colors
- glassmorphism
- unnecessary dark backgrounds
- giant navigation sidebars
- dense enterprise forms
- decorative animations that delay tasks
- inaccessible custom controls
- desktop-only layouts
- accidental horizontal page scrolling
- hardcoded financial policy values
- AI-generated eligibility explanations that change authoritative facts

---

# 42. Component Composition Rule

Prefer this hierarchy:

```text
Page
  ↓
Feature Section
  ↓
Reusable Feature Component
  ↓
Design-System Primitive
```

Example:

```text
IntakePage
  ↓
IntakeWizard
  ↓
AmountCard
  ↓
Slider + Button primitives
```

Business calculations remain outside this hierarchy.

---

# 43. Source-of-Truth Rule

When visual implementation conflicts with another source:

1. Product requirements define behavior.
2. Database/schema defines authoritative persisted policy data.
3. `ui_tokens.md` defines visual values.
4. `ui_rules.md` defines visual behavior.
5. `ui_registry.md` defines reusable component structure.

Do not silently invent a new rule.

---

# 44. Final UI Quality Gate

Before considering a UI feature complete, verify:

```text
[ ] Correct CrediX colors
[ ] Correct card identity
[ ] Correct typography hierarchy
[ ] Correct responsive behavior
[ ] No accidental horizontal overflow
[ ] Keyboard accessible
[ ] Visible focus
[ ] Screen-reader labels/statuses
[ ] Localized English
[ ] Localized Hindi
[ ] Loading state
[ ] Error state
[ ] Empty state where applicable
[ ] Disabled state where applicable
[ ] No hardcoded financial policy
[ ] No secrets in client code
[ ] Reuses existing components
[ ] Matches ui_tokens.md
[ ] Matches ui_registry.md
```

The supplied CrediX screenshots are the visual reference for the overall composition. New screens should feel like the same product rather than separate designs.


## Motion & Animation Rules

CrediX motion must feel warm, quick, calm, and purposeful. Motion supports comprehension; it must never compete with the financing task.

### Motion Hierarchy

Use:

```text
CSS/Tailwind
    ↓
Framer Motion
    ↓
GSAP
```

Choose the lowest layer capable of the required behavior.

### Global Rules

- Animations must not block interaction.
- Critical financial information must remain immediately readable.
- Motion must not delay navigation or form submission.
- Prefer opacity and transform animation.
- Avoid continuous animation unless it communicates live status.
- Avoid excessive bounce, elastic effects, spinning, or decorative motion.
- Preserve the four intake card identities and their semantic colors.
- Do not change the semantic meaning of card colors through animation.
- All animation must remain usable on mobile.
- Respect `prefers-reduced-motion`.

### Intake Wizard

The four-card flow is:

```text
Purpose → Amount → Income → Details
```

Recommended behavior:
- subtle entrance when a card becomes active
- short exit when moving to the next step
- preserve entered values during transitions
- do not animate the entire page unnecessarily
- never make the user wait for a transition before the next control is usable

### Card Motion

Purpose, Amount, Income, and Details cards may use:
- opacity
- small translation
- subtle scale where appropriate
- state transitions

Do not use large rotations or distracting 3D effects.

### Results

Results may reveal progressively:

```text
eligibility → recommended scheme → alternatives → funding → repayment → nearby partner
```

The reveal must be fast and must not hide important information.

### Repayment

EMI and funding figures may use a subtle number transition when values change, but:
- do not obscure the final amount
- do not count for long periods
- expose the final value immediately to assistive technology

### Branch Routing

Location/routing feedback may animate:
- permission state
- search progress
- branch result appearance

Never use animation to imply that a branch is viable before the server-side routing gatekeeper confirms it.

### Buttons

Buttons may use lightweight hover, focus, pressed, and disabled transitions.

Do not use large animated effects for primary financial actions.

### Loading

Loading animation must communicate real activity.

Never:
- animate fake progress
- imply a completed operation
- imply current branch health while data is stale
- imply dossier creation before server confirmation

### Modals and Drawers

Use short enter/exit transitions. Focus management must work independently of animation completion.

### Page Transitions

Use subtle route transitions only when they improve continuity.

Do not introduce transitions that delay navigation, interfere with browser history, or cause cumulative layout shift.

### Performance

Prefer:

```text
transform
opacity
```

Avoid frequent animation of:

```text
width
height
top
left
margin
padding
```

unless there is a strong UI reason and performance has been verified.

### Reduced Motion

When reduced motion is active:
- remove decorative movement
- minimize transitions
- disable complex GSAP timelines
- use immediate state changes where possible

Accessibility takes priority over visual motion.
