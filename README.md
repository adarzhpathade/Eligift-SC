# Eligify AI

Eligify AI is a premium AI-powered Government Scheme Discovery Platform. It acts as an intelligent guidance layer on top of official government systems to help citizens efficiently discover relevant schemes, verify eligibility, and become application-ready within minutes.

**Target Audience:** Students, Farmers, Doctors, Women, Senior Citizens, Entrepreneurs, and General Citizens.

## 🎯 Product Goals
- **Primary:** Help users discover eligible government schemes instantly.
- **Secondary:** Ensure users are fully application-ready with the correct documents before visiting official portals.
- **Tertiary:** Reduce unnecessary AI costs by utilizing deterministic, SQL-based recommendation systems instead of LLM matching.

## ✨ Features

- **Instant Recommendations:** Powered by a fast, deterministic SQL-based recommendation engine matching your profile (Occupation, State, Gender, Income, Age, Education). **AI is strictly forbidden for generic filtering and recommendations.**
- **Find Me Scheme:** A natural language discovery tool leveraging AI to help users find schemes through conversational prompts when they aren't sure what to search for.
- **Document Checker:** Uses AI to read user-uploaded documents and verify readiness requirements before applying, reducing application mistakes.
- **Native Mobile Experience:** Fully cross-platform architecture via Capacitor, featuring native haptics, splash screens, and native status bar integrations for Android.
- **Premium User Interface:** Built with Shadcn UI, GSAP micro-interactions, ReactBits Navigation, and tailored typography to evoke an emotion of *"Assisted Confidence"*.

## 🛠 Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn UI
- GSAP & Framer Motion
- ReactBits Navigation

**Mobile App (Native):**
- Capacitor v8 (Android / iOS)
- Native Haptics & System Interactions

**Backend & Database:**
- Supabase (Authentication, PostgreSQL Database, Storage)
- Drizzle ORM

**AI Engine:**
- Google Gemini / OpenAI (Restricted strictly to the Natural Language Finder and Document Checker)

## 🚀 Getting Started

First, make sure you have the required environment variables set up in your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# App Database URL (Transaction Pooler - Port 6543)
DATABASE_URL=...

# Migrations Database URL (Session Pooler - Port 5432)
DIRECT_URL=...

# AI Configuration
GEMINI_API_KEY=...
AI_MODEL="gemini-2.5-flash"
```

Then, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Mobile App (Capacitor)

Eligify AI is designed to run seamlessly on Android using Capacitor. It connects directly to the hosted web application (`https://eligify-gamma.vercel.app`) while leveraging native device features.

To sync the project with the native Android code:
```bash
npx cap sync android
```
To open the Android project in Android Studio:
```bash
npx cap open android
```

## 🗄️ Database Management

This project uses **Drizzle ORM** to manage database schemas. 

To push your local schema changes to the remote Supabase database:
```bash
npm run db:push
```

To seed the database with initial schemes and data:
```bash
npm run db:seed
```

## 🏗 Architecture & Design Notes

- **Fast First Architecture:** Recommendations and filtering run fully in SQL via Postgres, avoiding high memory footprints on the server.
- **Strict Separation of Concerns:** UI components are kept strictly presentational. Business logic lives in `/services` and `/actions`, and direct database calls from UI components are forbidden.
- **Design System:** Follows a *Premium Government SaaS* design language. Uses custom design tokens with a specific focus on high-contrast accessibility, tailored typography (*Plus Jakarta Sans*), and responsive Bento grids.

## 📄 License

MIT
