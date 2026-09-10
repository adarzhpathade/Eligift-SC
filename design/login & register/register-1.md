---
name: Premium Government AI Design System
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#0b0c0c'
  on-primary: '#ffffff'
  primary-container: '#222222'
  on-primary-container: '#8a8989'
  inverse-primary: '#c8c6c5'
  secondary: '#5f613a'
  on-secondary: '#ffffff'
  secondary-container: '#e2e3b2'
  on-secondary-container: '#64653e'
  tertiary: '#0b0d09'
  on-tertiary: '#ffffff'
  tertiary-container: '#21231e'
  on-tertiary-container: '#898a84'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1b1c1c'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e5e5b5'
  secondary-fixed-dim: '#c9c99b'
  on-secondary-fixed: '#1c1d01'
  on-secondary-fixed-variant: '#484925'
  tertiary-fixed: '#e3e3db'
  tertiary-fixed-dim: '#c6c7c0'
  on-tertiary-fixed: '#1a1c18'
  on-tertiary-fixed-variant: '#464742'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
This design system bridges the gap between institutional authority and modern AI efficiency. It targets high-stakes government operations where clarity, trust, and speed are paramount. The aesthetic is **Modern Corporate** with a focus on high-fidelity "Soft Minimalism"—utilizing a warm, sophisticated palette to reduce the typical clinical coldness of government software. 

The emotional response should be one of "Assisted Confidence." The UI feels expensive, stable, and highly legible. It borrows from luxury SaaS platforms to make complex civic workflows feel effortless and premium.

## Colors
The palette is built on a foundation of "Warm Ivory" and "Deep Charcoal" to ensure maximum contrast without the harshness of pure black-on-white.

- **Primary & Text:** A singular #222222 Deep Charcoal provides an authoritative anchor for all critical interactions and typography.
- **Accent:** #FEFECC Soft Pale Yellow is used sparingly for highlighting active states, AI-generated suggestions, or primary call-to-actions that require a soft, non-alarming focus.
- **Background:** #FAFAF2 Warm Cream acts as the canvas, providing a "paper-like" quality that feels premium and easy on the eyes during long sessions.
- **Surface:** Pure #FFFFFF is reserved for floating elements and cards to create clear physical separation from the background.

## Typography
We use **Plus Jakarta Sans** for its balanced, modern, and slightly optimistic character. The type scale is aggressive in its headers to emulate a modern SaaS feel, while the body copy remains spacious for readability.

- **Headlines:** Use tight letter-spacing (-0.01em to -0.02em) to give the deep charcoal text a "locked-in" and authoritative look.
- **Readability:** Line heights for body text are set at 1.6 to allow the eye to track easily through long government documents or data entries.
- **Labels:** Uppercase or semi-bold labels should be used for metadata to distinguish it from interactive text.

## Layout & Spacing
The layout follows a **Fixed Grid** approach for content-heavy pages to maintain readability, while utilizing a **Split-Screen** layout for complex data entry or AI-assisted flows.

- **Split-Screen Model:** On desktop, the left pane (40% width) typically houses the context, document viewer, or AI chat, while the right pane (60% width) contains the primary form or workspace.
- **Rhythm:** An 8px base unit is used. Use large 64px margins on desktop to allow the "Warm Cream" background to provide breathing room, creating an atmosphere of calm.
- **Reflow:** On mobile, the split-screen stacks vertically. The AI context pane becomes a collapsable bottom sheet or a top-pinned summary.

## Elevation & Depth
The design system uses **Ambient Shadows** to create a sense of physical layering without harsh lines. 

- **Level 0 (Background):** #FAFAF2.
- **Level 1 (Cards/Floating UI):** #FFFFFF with a soft, diffused shadow: `0px 10px 30px rgba(34, 34, 34, 0.05)`. This creates a "lifted" effect.
- **Level 2 (Modals/Popovers):** Higher elevation with a more pronounced shadow: `0px 20px 50px rgba(34, 34, 34, 0.1)`.
- **Interaction:** On hover, primary buttons and cards should slightly increase their shadow spread and lift (Y-axis translation) to indicate interactivity.

## Shapes
We employ a **Rounded** shape language to soften the authoritative nature of the tool. 

- **Components:** Standard inputs, buttons, and chips use a 12px (0.75rem) minimum radius. 
- **Cards:** Feature a larger 24px (1.5rem) radius to feel like distinct, approachable objects.
- **Icons:** Should be encased in soft-rounded containers when used for navigation or primary categories.

## Components
- **Buttons:** Large (48px - 56px height). Primary buttons are Deep Charcoal (#222222) with white text. They feature a subtle inner-glow or 1px border of the same color to maintain crispness. Hover state: Lighten the background slightly or apply the #FEFECC accent as a subtle glow.
- **Inputs:** 12px rounded corners with a 1px border (#222222 at 10% opacity). On focus, the border becomes 2px thick #222222 and the background remains white.
- **Progress Indicators:** Horizontal bars using a "beaded" style—circles connected by lines. Completed steps use the Charcoal color; current steps are highlighted with the Soft Yellow (#FEFECC).
- **Floating Cards:** All primary content sits in white cards with the defined Ambient Shadows. No borders are needed when sitting on the Warm Cream background.
- **Chips:** Small, highly rounded (pill-shaped) elements for status or categories. Use a tint of the status color (e.g., very light green for "Approved") to maintain the premium feel.
- **Transitions:** All hover, focus, and page transitions must use a `300ms cubic-bezier(0.4, 0, 0.2, 1)` easing for a professional, fluid motion.