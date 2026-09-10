# Mobile Conversion Context

## Objective

Convert the existing Eligify AI Next.js web application into a mobile application using Capacitor.

The application must continue to function as a web application while also supporting Android immediately and iOS in the future.

This is not a rewrite.

This is not a React Native migration.

This is not an Expo migration.

The existing Next.js codebase remains the single source of truth.

---

# Current Stack

Frontend:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn UI
- GSAP

Backend:
- Next.js Route Handlers
- Server Actions

Database:
- Supabase PostgreSQL
- Drizzle ORM

Storage:
- Supabase Storage

Authentication:
- Supabase Auth

AI:
- OpenAI

---

# Mobile Framework

Use:

Capacitor

Do not use:

- React Native
- Expo
- Flutter
- Ionic UI Components

Capacitor is only used as the native wrapper.

---

# Conversion Strategy

The web application already exists.

The goal is to:

1. Install Capacitor.
2. Configure Android support.
3. Ensure all screens are mobile responsive.
4. Ensure authentication works in mobile.
5. Ensure file uploads work in mobile.
6. Ensure AI features work in mobile.
7. Ensure navigation works in mobile.

The existing architecture must remain unchanged.

---

# Required Packages

Install:

npm install @capacitor/core
npm install @capacitor/cli
npm install @capacitor/android

Recommended:

npm install @capacitor/app
npm install @capacitor/preferences
npm install @capacitor/status-bar
npm install @capacitor/splash-screen
npm install @capacitor/haptics

---

# Setup Commands

Initialize Capacitor:

npx cap init

App Name:
Eligify AI

Package Name:
com.eligify.app

Add Android:

npx cap add android

---

# Build Flow

Web Build:

npm run build

Sync Capacitor:

npx cap sync

Open Android Studio:

npx cap open android

---

# Authentication Rules

Current auth provider:

Supabase Auth

Keep existing implementation.

Do not replace authentication.

Do not introduce:

- Firebase Auth
- Google Sign-In
- OAuth

Email/password login must continue to work.

---

# Storage Rules

Current storage:

Supabase Storage

Keep existing implementation.

Document uploads must continue to use:

documents bucket

No local file persistence.

---

# Navigation Rules

Current navigation:

ReactBits Menu

Must remain unchanged.

Do not replace navigation.

---

# Responsive Requirements

Every screen must support:

- 360px
- 390px
- 430px

widths.

---

# Dashboard Mobile

Current:

Bento Layout

Mobile:

Single-column stacked layout.

---

# Scheme List Mobile

Current:

Sidebar Filters

Mobile:

Bottom Sheet Filter Panel.

---

# Find Me Scheme Mobile

Current:

40 / 60 Split Layout

Mobile:

Prompt Area

↓

Results Area

---

# Apply Page Mobile

Current:

Checklist | Upload

Mobile:

Checklist

↓

Upload

↓

Analysis

---

# Profile Mobile

Current:

Centered Layout

Mobile:

Full-width card layout.

---

# Cursor Follower

Disable on mobile.

Keep on desktop.

---

# GSAP Rules

Keep:

- Card hover animations
- Page transitions

Remove:

- Cursor interactions on mobile

---

# Mobile Safe Areas

Respect:

- Android status bar
- Android navigation area

Use safe area padding.

---

# Capacitor Plugins Usage

## Haptics

Use for:

- Save Scheme
- Profile Saved
- Upload Complete
- AI Analysis Complete

---

## Status Bar

Use light status bar.

Match app background.

---

## Splash Screen

Create branded splash screen.

Logo centered.

Background:

#FAFAF2

---

# Performance Requirements

Initial load:

< 3 seconds

Navigation:

Instant

Scheme Search:

< 1 second

Dashboard:

< 2 seconds

---

# Build Verification Checklist

Authentication:
- Login works
- Logout works
- Session persists

Schemes:
- Search works
- Filters work
- Recommendation engine works

AI:
- Find Me Scheme works
- Document Checker works

Uploads:
- PDF upload works
- Image upload works

Navigation:
- ReactBits menu works

Mobile:
- No horizontal scroll
- No layout overflow
- No clipped content

---

# Success Criteria

The project is successful when:

- Existing web app remains unchanged.
- Android app builds successfully.
- Same codebase serves web and mobile.
- No duplicated screens.
- No React Native code exists.
- All major user flows work on Android.