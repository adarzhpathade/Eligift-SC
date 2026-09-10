# CrediX — UI Tokens

## 1. Purpose

This document is the visual source of truth for the CrediX citizen interface.

The token system is derived from the supplied CrediX UI references and must be used consistently across:
- landing page
- intake wizard
- Purpose card
- Amount card
- Income card
- Details card
- results
- repayment
- branch routing
- dossier/routing slip states
- menus and controls
- responsive layouts

The visual direction is intentionally warm, minimal, editorial, friendly, and high-contrast without looking like a conventional banking dashboard.

Do not introduce arbitrary brand colors when an existing token is appropriate.

---

# 2. Core Color Palette

## 2.1 Background

| Token | Value | Usage |
|---|---|---|
| `background` | `#fbf7ef` | Primary application/page background |

The main CrediX canvas uses a warm off-white rather than pure white.

Tailwind-compatible semantic name:

```text
bg-background
```

CSS variable:

```css
--background: #fbf7ef;
```

---

# 3. Primary Accent

## 3.1 Lavender Accent

| Token | Value | Usage |
|---|---|---|
| `accent` | `#e8ebff` | Accent surfaces, selected/secondary controls, soft UI backgrounds |
| `accent-border` | `#899bff` | Accent card/control borders |
| `accent-foreground` | `#899bff` | Accent headings, numbers, selected states |

CSS variables:

```css
--accent: #e8ebff;
--accent-border: #899bff;
--accent-foreground: #899bff;
```

Tailwind-compatible usage:

```text
bg-accent
border-accent-border
text-accent-foreground
```

The lavender system is the primary neutral accent and is used prominently for the Purpose experience and menu treatment.

---

# 4. Intake Card Color System

CrediX uses four visually distinct card families.

The colors are semantic and tied to the intake concepts.

---

## 4.1 Purpose

| Token | Value |
|---|---|
| `purpose-surface` | `#e8ebff` |
| `purpose-border` | `#899bff` |
| `purpose-foreground` | `#899bff` |

Purpose is the lavender card.

CSS:

```css
--purpose-surface: #e8ebff;
--purpose-border: #899bff;
--purpose-foreground: #899bff;
```

Tailwind-compatible:

```text
bg-purpose-surface
border-purpose-border
text-purpose-foreground
```

---

## 4.2 Amount

| Token | Value |
|---|---|
| `amount-surface` | `#caeb65` |
| `amount-border` | `#316045` |
| `amount-foreground` | `#316045` |

Amount is the bright lime/green card.

CSS:

```css
--amount-surface: #caeb65;
--amount-border: #316045;
--amount-foreground: #316045;
```

Tailwind-compatible:

```text
bg-amount-surface
border-amount-border
text-amount-foreground
```

The Amount card uses the dark green as its primary readable foreground against the lime surface.

---

## 4.3 Income

| Token | Value |
|---|---|
| `income-surface` | `#f5b2bd` |
| `income-border` | `#642731` |
| `income-foreground` | `#642731` |

Income is the soft pink card.

CSS:

```css
--income-surface: #f5b2bd;
--income-border: #642731;
--income-foreground: #642731;
```

Tailwind-compatible:

```text
bg-income-surface
border-income-border
text-income-foreground
```

The Income card uses the deep burgundy tone for headings, values, borders, and important supporting text.

---

## 4.4 Details

| Token | Value |
|---|---|
| `details-surface` | `#ebe3d4` |
| `details-border` | `#c3b591` |
| `details-foreground` | `#5f594d` |

Details is the warm beige/cream card.

CSS:

```css
--details-surface: #ebe3d4;
--details-border: #c3b591;
--details-foreground: #5f594d;
```

Tailwind-compatible:

```text
bg-details-surface
border-details-border
text-details-foreground
```

The Details card should feel softer and quieter than the Purpose, Amount, and Income cards.

---

# 5. Color Token Summary

```css
:root {
  /* Canvas */
  --background: #fbf7ef;

  /* Lavender / Purpose */
  --accent: #e8ebff;
  --accent-border: #899bff;
  --accent-foreground: #899bff;

  /* Amount / Lime */
  --amount-surface: #caeb65;
  --amount-border: #316045;
  --amount-foreground: #316045;

  /* Income / Pink */
  --income-surface: #f5b2bd;
  --income-border: #642731;
  --income-foreground: #642731;

  /* Details / Warm Beige */
  --details-surface: #ebe3d4;
  --details-border: #c3b591;
  --details-foreground: #5f594d;
}
```

---

# 6. Neutral Text System

The supplied UI references use black/dark text for primary page copy and deep semantic colors inside the intake cards.

Use the following semantic roles.

| Token | Value | Usage |
|---|---|---|
| `foreground` | `#111111` | Primary page text |
| `muted-foreground` | `#5f5f5f` | Secondary/supporting copy |
| `inverse` | `#ffffff` | Text on genuinely dark surfaces |
| `border` | `#111111` | Generic strong border where a neutral border is required |

CSS:

```css
--foreground: #111111;
--muted-foreground: #5f5f5f;
--inverse: #ffffff;
--border: #111111;
```

The primary page background is not white, so `foreground` should be used for normal page-level typography rather than relying on browser defaults.

---

# 7. Semantic Status Colors

The intake palette is the core brand system. Status colors must remain visually compatible with it.

Use semantic status tokens only when a status needs to be communicated independently of the four intake card colors.

```css
:root {
  --success: #316045;
  --success-surface: #caeb65;

  --warning: #8a6a20;
  --warning-surface: #f4e4b5;

  --error: #642731;
  --error-surface: #f5b2bd;

  --info: #899bff;
  --info-surface: #e8ebff;
}
```

These semantic mappings intentionally reuse the existing CrediX palette wherever practical.

Do not introduce neon red, generic Bootstrap green, or unrelated blue unless a specific accessibility requirement makes it necessary and the design system is explicitly updated.

---

# 8. Typography

## 8.1 General Direction

The supplied references use a clean, modern sans-serif visual style with large editorial headings, generous whitespace, and occasional italic emphasis.

The implementation should use one primary sans-serif family throughout the product unless the project explicitly selects a specific licensed/web font.

Recommended fallback stack:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Hindi rendering must have an appropriate Devanagari fallback.

Recommended multilingual stack:

```css
font-family:
  Inter,
  "Noto Sans Devanagari",
  ui-sans-serif,
  system-ui,
  sans-serif;
```

Do not mix multiple decorative font families.

---

# 9. Font Weights

Use a restrained weight scale.

| Token | Weight | Usage |
|---|---:|---|
| `font-normal` | `400` | Body copy |
| `font-medium` | `500` | Controls and emphasized labels |
| `font-semibold` | `600` | Card headings / important labels |
| `font-bold` | `700` | Major numeric emphasis |
| `font-black` | `900` | Only for exceptional hero numerals |

The supplied references rely more on scale, whitespace, and color than on heavy typography.

Do not make every heading bold.

---

# 10. Typography Scale

Use a responsive scale.

| Token | Desktop | Mobile | Usage |
|---|---:|---:|---|
| `display` | `64px` | `42px` | Main hero heading |
| `h1` | `48px` | `36px` | Page heading |
| `h2` | `36px` | `30px` | Major section heading |
| `h3` | `28px` | `24px` | Card heading |
| `h4` | `22px` | `20px` | Subsection |
| `body-lg` | `20px` | `18px` | Intro/supporting copy |
| `body` | `16px` | `16px` | Normal body text |
| `body-sm` | `14px` | `14px` | Supporting metadata |
| `caption` | `13px` | `13px` | Fine print |

The large headings should remain visually generous but must not create horizontal overflow on small screens.

---

# 11. Italic Typography

The supplied designs use italic text for:
- short questions
- supporting prompts
- emphasized words such as the hero action word
- explanatory card subtitles

Use italic selectively.

Examples:

```text
What are we funding today?
How much money do you need?
What is your annual family income?
Just Basic Applicant Details
```

Do not make complete long paragraphs italic.

---

# 12. Spacing Scale

Use a 4px base spacing system.

| Token | Value |
|---|---:|
| `space-0` | `0px` |
| `space-1` | `4px` |
| `space-2` | `8px` |
| `space-3` | `12px` |
| `space-4` | `16px` |
| `space-5` | `20px` |
| `space-6` | `24px` |
| `space-8` | `32px` |
| `space-10` | `40px` |
| `space-12` | `48px` |
| `space-16` | `64px` |
| `space-20` | `80px` |
| `space-24` | `96px` |
| `space-32` | `128px` |

Tailwind-compatible naming should use the normal Tailwind spacing scale wherever possible.

---

# 13. Layout Spacing

The supplied desktop design uses generous whitespace.

Recommended page-level spacing:

```text
Desktop horizontal padding: 48px–64px
Tablet horizontal padding: 32px–40px
Mobile horizontal padding: 20px–24px
```

Hero sections may use larger vertical spacing:

```text
Desktop: 80px–128px
Mobile: 48px–80px
```

Do not compress the design into a dense dashboard layout.

---

# 14. Card Dimensions

Cards should feel substantial and editorial.

Recommended desktop card behavior:

```text
Minimum height: 320px
Preferred height: 330–420px
Border radius: 8px–12px
Border: 1.5px–2px
```

The exact height may vary by content.

The Amount and Income cards may use larger numeric content and therefore need additional internal vertical space.

The Details card needs enough room for:
- name
- gender
- SC declaration
- supporting copy

---

# 15. Border System

The supplied references use clear thin borders around colored cards.

Recommended border widths:

| Token | Value |
|---|---:|
| `border-thin` | `1px` |
| `border-default` | `1.5px` |
| `border-strong` | `2px` |

Default intake card border:

```text
1.5px–2px
```

Do not use heavy shadows to replace the visible border language.

---

# 16. Radius System

The supplied cards and menu use modest rounded corners.

| Token | Value |
|---|---:|
| `radius-sm` | `4px` |
| `radius-md` | `8px` |
| `radius-lg` | `12px` |
| `radius-xl` | `16px` |
| `radius-pill` | `9999px` |

Use:

```text
radius-lg
```

for primary cards unless the component specification says otherwise.

The top-right Menu control uses a pill treatment.

---

# 17. Shadow System

The reference UI is primarily border-driven.

Use minimal shadows.

| Token | Value |
|---|---|
| `shadow-none` | `none` |
| `shadow-sm` | `0 1px 2px rgba(17,17,17,0.06)` |
| `shadow-md` | `0 4px 12px rgba(17,17,17,0.08)` |
| `shadow-lg` | `0 12px 30px rgba(17,17,17,0.10)` |

Default intake cards:

```text
shadow-none
```

Use shadows only when a floating element genuinely needs elevation.

---

# 18. Menu Control

The supplied UI shows a top-right pill-shaped menu.

Recommended tokens:

```text
Surface: #e8ebff
Border: #899bff
Foreground: #111111
Radius: 9999px
```

The visual pattern is:

```text
+ Menu
```

The plus icon and label should be aligned horizontally.

The control should have enough padding to feel like a floating utility rather than a conventional navigation bar button.

---

# 19. Hero Treatment

The landing page should preserve the editorial hierarchy shown in the supplied reference.

Pattern:

```text
Welcome,

What are we funding today?
```

The emphasized action word may use:
- italic
- accent lavender
- medium/semibold emphasis

The hero should not become a dense marketing banner.

---

# 20. "Loan Ready in X Clicks" Treatment

The intake experience uses a visible progress statement.

Pattern:

```text
Loan Ready in 4 Clicks
```

or:

```text
Loan Ready in 3 more Clicks
```

The number is visually emphasized.

Recommended:
- number uses a larger size
- number uses the active card's semantic foreground color
- surrounding text uses normal foreground
- wording remains localized

Example:

```text
Loan Ready in [4] Clicks
```

The number should never be hardcoded in the UI. It must derive from wizard state.

---

# 21. Intake Color Assignment

The four intake concepts map permanently to these visual identities:

```text
Purpose → Lavender
Amount  → Lime
Income  → Pink
Details → Warm Beige
```

Do not swap these colors between steps.

This color association becomes part of the user's visual navigation model.

---

# 22. Active Card Treatment

When a card is active:
- retain its semantic surface color
- retain its semantic border
- increase visual prominence through scale, spacing, or positioning
- do not replace the card with a generic blue/white active state

Example:

```text
Purpose active
→ #e8ebff surface
→ #899bff border
→ #899bff accent text
```

---

# 23. Disabled Treatment

Disabled controls must remain understandable without becoming invisible.

Recommended approach:
- reduce opacity
- preserve semantic color family
- use `cursor-not-allowed`
- prevent interaction
- maintain readable text contrast

Do not replace disabled cards with unrelated gray blocks.

---

# 24. Focus Treatment

Keyboard focus must remain clearly visible.

Recommended focus ring:

```text
2px solid #899bff
2px offset
```

For controls on lavender backgrounds, use an additional outline/offset so the focus state remains visible.

Never remove the browser focus indicator without replacing it with an equally clear or stronger treatment.

---

# 25. Motion Tokens

Animation should be subtle.

| Token | Duration |
|---|---:|
| `duration-fast` | `120ms` |
| `duration-normal` | `200ms` |
| `duration-slow` | `300ms` |
| `duration-emphasis` | `450ms` |

Recommended easing:

```text
ease-out
```

Use motion for:
- card transitions
- slider feedback
- menu opening
- loading transitions
- wizard step transitions

Do not animate financial values so aggressively that they become difficult to read.

---

# 26. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled:
- remove nonessential transitions
- remove large sliding animations
- avoid parallax
- keep state changes immediate

---

# 27. Z-Index System

Use a small predictable scale.

| Token | Value | Usage |
|---|---:|---|
| `z-base` | `0` | Normal content |
| `z-raised` | `10` | Raised cards |
| `z-sticky` | `20` | Sticky controls |
| `z-dropdown` | `30` | Menus/dropdowns |
| `z-modal` | `40` | Modal/dialog |
| `z-toast` | `50` | Toast/notification |
| `z-critical` | `60` | Critical application overlay |

Avoid arbitrary z-index values.

---

# 28. Breakpoints

Use the standard responsive breakpoints:

| Token | Width |
|---|---:|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px |
| `2xl` | `1536px` |

Primary design targets:

```text
Mobile: < 640px
Tablet: 640px–1023px
Desktop: ≥ 1024px
Large desktop: ≥ 1280px
```

The supplied mobile reference demonstrates that the composition must adapt rather than simply shrink.

---

# 29. Responsive Card Behavior

Desktop:

```text
Horizontal/card-based composition
Large whitespace
Large active card
Adjacent cards may remain partially visible where intentionally designed
```

Mobile:

```text
Single-column or controlled horizontal-scroll composition
Readable card width
No accidental page-level horizontal overflow
Large touch targets
Reduced heading scale
```

Do not preserve a desktop three-column layout on a narrow mobile viewport.

---

# 30. Numeric Display Tokens

Amounts and financial values are visually important.

Recommended:

```text
Numeric font weight: 500–700
Large amount size: 56px–88px desktop
Large amount size: 40px–56px mobile
```

Use Indian number formatting:

```text
₹50,000
₹1,50,000
₹5,00,000
```

Never place currency symbols or commas into calculation state.

---

# 31. Slider Tokens

The Amount and Income references use a minimal horizontal slider.

Recommended:
- track: semantic foreground
- thumb: same semantic foreground or outlined semantic control
- thumb radius: `50%`
- track height: `3px–4px`
- touch target: at least `44px` high even if the visible track is thinner

Example Amount slider:

```text
Surface: #caeb65
Track: #316045
Thumb: #caeb65
Thumb border: #316045
```

Example Income slider:

```text
Surface: #f5b2bd
Track: #642731
Thumb: #f5b2bd
Thumb border: #642731
```

---

# 32. Form Field Tokens

The Details card uses a quiet, centered form presentation.

Recommended:
- transparent or background-matched input surface
- semantic border
- strong focus state
- centered labels/values where the composition calls for it
- no unnecessary input chrome

The Details card should feel like part of the visual composition rather than a conventional enterprise form.

---

# 33. Accessibility Contrast

The visual palette must be preserved, but text must remain readable.

Use the dark semantic foreground colors against their corresponding surfaces:

```text
Amount:
#316045 on #caeb65

Income:
#642731 on #f5b2bd

Details:
#5f594d on #ebe3d4

Purpose:
#899bff on #e8ebff
```

If a particular text size fails the project's accessibility contrast target, use a darker semantic text token or adjust the size/weight rather than adding an unrelated brand color.

Do not use the light lavender `#e8ebff` as text on a light background.

---

# 34. Tailwind Semantic Mapping

The implementation should expose semantic classes/tokens rather than repeatedly using raw hex values.

Recommended mapping:

```text
bg-background
text-foreground
text-muted-foreground

bg-accent
border-accent-border
text-accent-foreground

bg-purpose-surface
border-purpose-border
text-purpose-foreground

bg-amount-surface
border-amount-border
text-amount-foreground

bg-income-surface
border-income-border
text-income-foreground

bg-details-surface
border-details-border
text-details-foreground

bg-success-surface
text-success
bg-warning-surface
text-warning
bg-error-surface
text-error
bg-info-surface
text-info
```

---

# 35. Raw Color Usage Rule

Raw hex values should be defined once in the design-token layer.

Do not repeatedly write:

```tsx
className="bg-[#caeb65]"
```

throughout components.

Prefer:

```tsx
className="bg-amount-surface"
```

This keeps the UI maintainable and allows the design system to evolve without searching the entire codebase.

---

# 36. Token Implementation Example

The exact Tailwind integration may vary with the installed Tailwind version, but the semantic CSS variables should remain stable.

Example:

```css
:root {
  --background: #fbf7ef;
  --foreground: #111111;
  --muted-foreground: #5f5f5f;

  --accent: #e8ebff;
  --accent-border: #899bff;
  --accent-foreground: #899bff;

  --purpose-surface: #e8ebff;
  --purpose-border: #899bff;
  --purpose-foreground: #899bff;

  --amount-surface: #caeb65;
  --amount-border: #316045;
  --amount-foreground: #316045;

  --income-surface: #f5b2bd;
  --income-border: #642731;
  --income-foreground: #642731;

  --details-surface: #ebe3d4;
  --details-border: #c3b591;
  --details-foreground: #5f594d;

  --success: #316045;
  --success-surface: #caeb65;

  --warning: #8a6a20;
  --warning-surface: #f4e4b5;

  --error: #642731;
  --error-surface: #f5b2bd;

  --info: #899bff;
  --info-surface: #e8ebff;
}
```

---

# 37. Design System Non-Violation Rules

AI coding agents must not:

- replace `#fbf7ef` with pure white globally
- replace the lavender Purpose system with generic blue
- replace Amount lime with generic green
- replace Income pink with generic red
- replace Details beige with generic gray
- introduce gradients into the intake cards
- add large drop shadows to every card
- turn the experience into a conventional banking dashboard
- use arbitrary colors without updating this token document
- create one-off card colors for individual steps
- remove the visual distinction between the four intake concepts
- create responsive layouts that cause accidental horizontal page scrolling
- use low-contrast decorative text that interferes with readability

---

# 38. Visual Source-of-Truth Mapping

The supplied reference screens establish these core visual facts:

```text
Application background
→ #fbf7ef

Primary lavender/accent
→ #e8ebff
→ border/accent #899bff

Purpose
→ #e8ebff / #899bff

Amount
→ #caeb65 / #316045

Income
→ #f5b2bd / #642731

Details
→ #ebe3d4 / #c3b591
```

These values are the canonical CrediX intake palette.

Future UI work must extend this system rather than replace it.
