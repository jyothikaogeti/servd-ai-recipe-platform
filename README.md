<div align="center">

# 🍳 Servd - AI-Powered Recipe Platform

**Snap a photo of your fridge. Get a chef-quality recipe in seconds.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Strapi](https://img.shields.io/badge/Strapi-5-4945FF?logo=strapi&logoColor=white)](https://strapi.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Arcjet](https://img.shields.io/badge/Arcjet-Security-FF5D01)](https://arcjet.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

</div>

---

## 📖 Overview

**Servd** is a AI-powered recipe discovery and pantry intelligence platform designed to help users reduce food waste, discover personalized meals, and streamline everyday cooking decisions.

The application combines:

- AI-driven pantry image recognition
- Personalized recipe generation
- Smart ingredient-based meal recommendations
- User recipe collections
- Secure authentication
- Tier-based usage controls
- Scalable headless CMS architecture

### 🎯 Problem Statement

| Problem                                                                         | Servd's Solution                                                               |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| People throw away food because they don't know what to make with what they have | AI-powered pantry photo scanning identifies ingredients instantly              |
| Generic recipe sites don't account for _your_ actual ingredients                | AI generates recipes matched to your pantry with a calculated match percentage |
| Regenerating the same AI recipe repeatedly wastes inference cost                | A cache-first lookup checks the database before calling the LLM                |
| Free AI features are expensive to run at scale without limits                   | Tiered, per-user rate limiting (Free vs. Pro) enforced at the edge             |
| Cooking apps are clunky on mobile, where most kitchen use happens               | Mobile-first capture flow with native camera access and drag-and-drop fallback |

---

## ✨ Key Features

### 🧠 AI-Powered Intelligence

- **Computer-Vision Pantry Scanning** — Upload or photograph a fridge/pantry; Google Gemini's multimodal vision model extracts a structured JSON list of ingredients with estimated quantities and confidence scores, automatically filtering out low-confidence detections.
- **AI Recipe Generation** — Generates complete, structured recipes (ingredients, numbered instructions, nutrition ranges, substitutions, chef tips) from a free-text dish name, with strict prompt-engineered JSON schemas and post-generation validation against allowed category/cuisine enums.
- **Pantry-to-Recipe Matching** — Suggests multiple recipes ranked by ingredient-match percentage against the user's live pantry inventory, flagging missing items needed to complete the dish.
- **Recipe De-duplication Cache** — Before invoking the LLM, the system performs a case-insensitive title lookup against the database; only cache misses trigger a new (costly) AI generation call.

### 🥘 Recipe Discovery & Management

- Public recipe catalog browsing by **category** (breakfast, dessert, seafood, etc.) and **world cuisine** (35+ countries) sourced from TheMealDB.
- "Recipe of the Day" hero spotlight on the dashboard.
- Personal **digital cookbook** — save/unsave recipes to a private collection with optimistic UI feedback.
- **One-click PDF export** of any recipe (ingredients + instructions + tips) for offline/printable use.

### 🧺 Smart Pantry Management

- Full CRUD pantry inventory scoped per authenticated user.
- Dual ingredient-entry workflow: AI photo scan **or** manual entry, unified through a single tabbed modal.
- Mobile camera capture (`capture="environment"`) with drag-and-drop desktop fallback via `react-dropzone`.

### 💳 Monetization & Access Control

- **Freemium tiering** (Free vs. Pro) with native **Clerk Billing** checkout integration.
- Server-enforced usage quotas per tier (pantry scans, AI recommendations) using sliding-window token-bucket rate limiting — not just a UI-level restriction.
- Reusable **paywall UI primitive** (`ProLockedSection`) that blurs gated content and overlays an upgrade CTA, used consistently across premium features (nutrition data, substitutions, unlimited scans).

### 🔐 Security & Auth

- Full authentication lifecycle (sign up, sign in, session management) via **Clerk**, including a custom neobrutalist UI theme.
- Edge-level **bot detection** and **WAF shielding** (Arcjet `shield` + `detectBot`) applied to every request through middleware, before it ever reaches a route handler.
- Route-level access control protecting `/dashboard`, `/recipe`, `/recipes`, and `/pantry` from unauthenticated access.

---

## 🌍 Real-World Use Cases

- **Reduce household food waste** — surface recipes for ingredients about to expire instead of letting them go unused.
- **Budget-conscious meal planning** — cook with what's already purchased rather than buying more groceries.
- **Recipe discovery for indecisive cooks** — browse by mood, cuisine, or category without leaving the app.
- **Meal-prep documentation** — export any recipe to a clean, shareable PDF for a physical cookbook or meal-prep binder.
- **SaaS monetization case study** — a working example of metering generative-AI features behind a freemium paywall without exposing usage logic to the client.

---

## 🏗️ Tech Stack

### Frontend — `servd-frontend`

| Technology                     | Purpose                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------- |
| ⚡ **Next.js 16 (App Router)** | Server Components, Server Actions, file-based routing, route groups               |
| ⚛️ **React 19**                | Component model, hooks, Suspense                                                  |
| 🎨 **Tailwind CSS v4**         | Utility-first, zero-runtime styling with custom neobrutalist design tokens        |
| 🧩 **shadcn/ui + Radix UI**    | Accessible, composable, unstyled primitives (Dialog, Tabs, etc.)                  |
| 🎯 **lucide-react**            | Consistent SVG icon set                                                           |
| 🔐 **Clerk**                   | Sign-in/up, session management, route protection, native subscription checkout    |
| 🧠 **Google Gemini**           | Multimodal vision (ingredient recognition) + structured text generation (recipes) |
| 🛡️ **Arcjet**                  | Bot detection, WAF shield, per-user token-bucket rate limiting                    |
| 📤 **react-dropzone**          | Drag-and-drop + native camera capture for pantry photos                           |
| 📄 **@react-pdf/renderer**     | Client-side recipe-to-PDF export                                                  |
| 🔔 **sonner**                  | Toast notifications for async action feedback                                     |
| ⏳ **react-spinners**          | Async loading states                                                              |

### Backend — `servd-backend`

| Technology                              | Purpose                                                            |
| --------------------------------------- | ------------------------------------------------------------------ |
| ⚡ **Strapi 5 (headless CMS)**          | REST API generation, content modeling, admin panel, RBAC           |
| 🗄️ **PostgreSQL (`pg`)**                | Persistent relational storage, environment-driven client selection |
| 🔐 **@strapi/plugin-users-permissions** | Role-based REST permissions, custom user schema extension          |
| ☁️ **@strapi/plugin-cloud**             | Strapi Cloud deployment readiness                                  |
| 🧩 **React 18 + styled-components**     | Strapi's bundled content-management dashboard                      |

### External Data & AI Services

| Service                                                         | Role                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Google Gemini** (`gemini-2.5-flash`, `gemini-2.5-flash-lite`) | Vision-based ingredient detection; structured JSON recipe & recommendation generation |
| **TheMealDB** (public REST API)                                 | Curated recipe catalog: categories, cuisines/areas, "Recipe of the Day"               |
| **Unsplash API**                                                | Auto-fetched hero imagery for AI-generated recipes that have no native photo          |
| **Clerk Billing**                                               | Subscription checkout, plan entitlement checks (`auth().has({ plan })`)               |

---

## 📁 Folder Structure

```text
servd-frontend/
├── actions/
│   ├── recipe.actions.js        # AI recipe generation, save/unsave
│   ├── pantry.actions.js        # AI pantry scanning, pantry CRUD
│   └── mealdb.actions.js        # Recipe catalog (TheMealDB) fetches
├── app/
│   ├── (auth)/                  # Sign-in / sign-up pages (Clerk)
│   ├── (main)/                  # Dashboard, recipes & pantry pages
│   ├── layout.js                # Root layout & global providers
│   └── page.js                  # Landing page
├── components/
│   ├── ui/                      # Shadcn/UI primitives (Button, Card, Dialog...)
│   ├── ImageUploader.js          # Pantry photo upload (camera + drag-drop)
│   ├── RecipeCard.js             # Recipe display card
│   ├── ProLockedSection.js       # Pro-feature paywall overlay
│   └── RecipePDF.js              # Recipe-to-PDF export
├── hooks/
│   └── useFetch.js               # Async state wrapper for Server Actions
├── lib/
│   ├── arcjet.js                  # Rate limiting & bot protection
│   ├── checkUser.js                # Clerk ↔ Strapi user sync
│   └── utils.js                     # Shared helper functions
├── public/
│   └── logo-orange.png
├── proxy.js                          # Auth + security middleware
└── package.json

servd-backend/
├── config/
│   └── database.js              # Database connection settings
├── src/
│   ├── api/
│   │   ├── recipe/              # Recipe model, routes & controller
│   │   ├── pantry-item/         # Pantry item model, routes & controller
│   │   └── saved-recipe/        # Saved recipe model, routes & controller
│   └── extensions/
│       └── users-permissions/   # Extended User model (Clerk fields)
└── package.json

```

---

## 🗄️ Database Schema

This project uses **Strapi 5** as a headless CMS data layer, backed by a relational database (**PostgreSQL** in production, with **SQLite**/**MySQL** also supported via the `DATABASE_CLIENT` environment variable). Tables are defined declaratively through Strapi **content-type schemas** (`schema.json`), which Strapi translates into actual database columns at runtime. Every collection type below automatically receives an `id` (integer primary key), a `documentId` (Strapi 5's unique document identifier), and `createdAt`/`updatedAt` timestamps; content types with Draft & Publish enabled also receive a `publishedAt` timestamp.

### Users

Stores application user accounts (Strapi's `up_users` table), extended to bridge Clerk-based authentication with the app's relational data and Strapi's built-in role-based access control.

| Field                    | Type                        | Description                                                                |
| ------------------------ | --------------------------- | -------------------------------------------------------------------------- |
| **`id`**                 | integer                     | Primary key, auto-incrementing                                             |
| **`documentId`**         | string                      | Strapi 5 unique document identifier                                        |
| **`username`**           | string                      | Unique username, required, minimum length 3                                |
| **`email`**              | email                       | Unique user email address, required, minimum length 6                      |
| **`provider`**           | string                      | Authentication provider identifier (Strapi default field)                  |
| **`password`**           | password                    | Hashed password, private (never exposed via API)                           |
| **`resetPasswordToken`** | string                      | Token used for the password-reset flow, private                            |
| **`confirmationToken`**  | string                      | Email confirmation token, private                                          |
| **`confirmed`**          | boolean                     | Whether the account is confirmed, defaults to `false`                      |
| **`blocked`**            | boolean                     | Whether the account is blocked from access, defaults to `false`            |
| **`clerkId`**            | string                      | **Unique**, required — links this record to the corresponding Clerk user   |
| **`firstName`**          | string                      | User's first name                                                          |
| **`lastName`**           | string                      | User's last name                                                           |
| **`imageUrl`**           | string                      | Profile image URL synced from Clerk                                        |
| **`subscriptionTier`**   | enumeration (`free`, `pro`) | Current billing tier, synced from Clerk Billing                            |
| **`role`**               | relation (many-to-one)      | Foreign key to Strapi's built-in role table (`up_roles`); RBAC permissions |
| **`recipes`**            | relation (one-to-many)      | All recipes authored by this user → **Recipes**                            |
| **`pantry_items`**       | relation (one-to-many)      | All pantry items owned by this user → **Pantry Items**                     |
| **`saved_recipes`**      | relation (one-to-many)      | All recipes saved by this user → **Saved Recipes**                         |
| **`createdAt`**          | datetime                    | Record creation timestamp                                                  |
| **`updatedAt`**          | datetime                    | Record last-updated timestamp                                              |

### Recipes

Stores both AI-generated and catalog recipes, including structured ingredients, instructions, and nutrition data (`recipes` table).

| Field               | Type                   | Description                                                                                                                                                                                                                                |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`id`**            | integer                | Primary key, auto-incrementing                                                                                                                                                                                                             |
| **`documentId`**    | string                 | Strapi 5 unique document identifier                                                                                                                                                                                                        |
| **`title`**         | string                 | Recipe title, required                                                                                                                                                                                                                     |
| **`description`**   | blocks                 | Rich-text description of the dish                                                                                                                                                                                                          |
| **`cuisine`**       | enumeration            | Cuisine type — one of: italian, chinese, mexican, indian, american, thai, japanese, mediterranean, french, korean, vietnamese, spanish, greek, turkish, moroccan, brazilian, caribbean, middle-eastern, british, german, portuguese, other |
| **`category`**      | enumeration            | Meal category — one of: breakfast, lunch, dinner, snack, dessert                                                                                                                                                                           |
| **`ingredients`**   | json                   | Structured array of ingredient objects (`item`, `amount`, `category`), required                                                                                                                                                            |
| **`instructions`**  | json                   | Structured array of step objects (`step`, `title`, `instruction`, `tip`), required                                                                                                                                                         |
| **`imageUrl`**      | string                 | URL of the recipe's hero image (Unsplash-sourced for AI-generated recipes)                                                                                                                                                                 |
| **`isPublic`**      | boolean                | Whether the recipe is publicly visible, required, defaults to `false`                                                                                                                                                                      |
| **`author`**        | relation (many-to-one) | **Foreign key** → **Users** (`author`); the user who generated/authored the recipe                                                                                                                                                         |
| **`prepTime`**      | integer                | Preparation time in minutes                                                                                                                                                                                                                |
| **`cookTime`**      | integer                | Cooking time in minutes                                                                                                                                                                                                                    |
| **`servings`**      | integer                | Number of servings the recipe yields                                                                                                                                                                                                       |
| **`nutrition`**     | json                   | Estimated nutrition object (`calories`, `protein`, `carbs`, `fat` ranges)                                                                                                                                                                  |
| **`tips`**          | json                   | Array of general cooking tips                                                                                                                                                                                                              |
| **`substitutions`** | json                   | Array of ingredient substitution objects (`original`, `alternatives`)                                                                                                                                                                      |
| **`saved_recipes`** | relation (one-to-many) | All **Saved Recipes** join records pointing to this recipe                                                                                                                                                                                 |
| **`createdAt`**     | datetime               | Record creation timestamp                                                                                                                                                                                                                  |
| **`updatedAt`**     | datetime               | Record last-updated timestamp                                                                                                                                                                                                              |
| **`publishedAt`**   | datetime               | Publish timestamp (Draft & Publish enabled on this content type)                                                                                                                                                                           |

### Pantry Items

Stores each user's individual pantry/fridge inventory, sourced from AI photo scans or manual entry (`pantry_items` table).

| Field             | Type                   | Description                                                               |
| ----------------- | ---------------------- | ------------------------------------------------------------------------- |
| **`id`**          | integer                | Primary key, auto-incrementing                                            |
| **`documentId`**  | string                 | Strapi 5 unique document identifier                                       |
| **`name`**        | string                 | Ingredient name, required                                                 |
| **`quantity`**    | string                 | Estimated quantity with unit (e.g., "2 cups")                             |
| **`imageUrl`**    | string                 | Optional image URL associated with the item                               |
| **`owner`**       | relation (many-to-one) | **Foreign key** → **Users** (`owner`); the user who owns this pantry item |
| **`createdAt`**   | datetime               | Record creation timestamp                                                 |
| **`updatedAt`**   | datetime               | Record last-updated timestamp                                             |
| **`publishedAt`** | datetime               | Publish timestamp (Draft & Publish enabled on this content type)          |

### Saved Recipes

A join table linking users to the recipes they have saved into their personal collection (`saved_recipes` table).

| Field             | Type                   | Description                                                         |
| ----------------- | ---------------------- | ------------------------------------------------------------------- |
| **`id`**          | integer                | Primary key, auto-incrementing                                      |
| **`documentId`**  | string                 | Strapi 5 unique document identifier                                 |
| **`savedAt`**     | datetime               | Timestamp of when the recipe was saved to the user's collection     |
| **`user`**        | relation (many-to-one) | **Foreign key** → **Users** (`user`); who saved the recipe          |
| **`recipe`**      | relation (many-to-one) | **Foreign key** → **Recipes** (`recipe`); the recipe that was saved |
| **`createdAt`**   | datetime               | Record creation timestamp                                           |
| **`updatedAt`**   | datetime               | Record last-updated timestamp                                       |
| **`publishedAt`** | datetime               | Publish timestamp (Draft & Publish enabled on this content type)    |

#### Relationships Overview

- **Users → Recipes**: one-to-many (`author`/`recipes`) — a user can author many recipes.
- **Users → Pantry Items**: one-to-many (`owner`/`pantry_items`) — a user owns many pantry items.
- **Users → Saved Recipes**: one-to-many (`user`/`saved_recipes`) — a user can save many recipes.
- **Recipes → Saved Recipes**: one-to-many (`recipe`/`saved_recipes`) — a recipe can be saved by many users.
- **Saved Recipes** functions as the many-to-many junction table between **Users** and **Recipes**.
- **Users → Roles**: many-to-one (`role`), referencing Strapi's internal `up_roles` table for RBAC permissions (this table is part of the default `users-permissions` plugin and was not customized in this project).

## 🔐 Authentication & Security

| Layer                      | Implementation                                                                                                                                                                                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identity**               | Clerk handles sign-up, sign-in, session tokens, and modal-based auth UI with a custom neobrutalist theme.                                                                                                                                                        |
| **Route Protection**       | `clerkMiddleware` + `createRouteMatcher` in `proxy.js` redirects unauthenticated users away from `/dashboard`, `/recipe`, `/recipes`, and `/pantry` before any page code executes.                                                                               |
| **Perimeter Security**     | Every request first passes through `Arcjet.protect()` — `shield()` (OWASP-style attack detection) and `detectBot()` (allow-listing search engines/preview bots, blocking the rest) — denying requests with a `403` before they reach Clerk or application logic. |
| **API Token Isolation**    | The Strapi `STRAPI_API_TOKEN` is read only in Server Actions (server runtime), never bundled into client JavaScript.                                                                                                                                             |
| **Per-User Rate Limiting** | Token-bucket algorithms (`@arcjet/next`'s `tokenBucket`) keyed by `userId` enforce monthly quotas — 10 pantry scans / 5 AI recommendations on the Free tier, 1,000/day on Pro — directly inside the Server Action, independent of any client-side state.         |
| **Plan Entitlements**      | `auth().has({ plan: "pro_user" })` (Clerk Billing) is the single source of truth for tier status, synced into Strapi on each `checkUser()` call so backend records stay consistent with billing state.                                                           |
| **Input Validation**       | All AI-sourced JSON (recipe categories, cuisines, ingredient confidence scores) is validated against allow-lists with safe fallbacks before being persisted — preventing malformed LLM output from corrupting the database.                                      |

---

## 🔌 API & Integration Layer

Servd doesn't expose a public REST/GraphQL API of its own for the frontend — it deliberately uses **Next.js Server Actions** as a type-safe, zero-boilerplate RPC layer directly into Strapi's REST API and third-party services. This collapses the typical "API route → fetch → API route" indirection into a single server-side function call.

| Action Module       | Responsibilities                                                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pantry.actions.js` | `scanPantryImage` (Gemini vision call + Arcjet rate limit), `saveToPantry`, `addPantryItemManually`, `getPantryItems`, `updatePantryItem`, `deletePantryItem`                                                           |
| `recipe.actions.js` | `getRecipesByPantryIngredients` (AI recommendation engine), `getOrGenerateRecipe` (cache-then-generate pipeline + Unsplash image enrichment), `saveRecipeToCollection`, `removeRecipeFromCollection`, `getSavedRecipes` |
| `mealdb.actions.js` | `getRecipeOfTheDay`, `getCategories`, `getAreas`, `getMealsByCategory`, `getMealsByArea` — all using Next.js `fetch` with `revalidate` windows for built-in caching                                                     |

**Strapi REST conventions used throughout:** Bearer-token authenticated requests, deep relational filtering (`filters[owner][id][$eq]`), nested population (`populate[recipe][populate]=*`), and case-insensitive equality search (`filters[title][$eqi]`) for the recipe-deduplication lookup.

---

## ⚙️ State Management

Servd intentionally **avoids a global state library** (Redux/Zustand) — a deliberate architectural choice justified by the data flow:

- **Server state** (recipes, pantry items, user profile) lives in Strapi and is fetched fresh via Server Actions on each request — there is no client-side cache to keep in sync.
- **`useFetch` (custom hook)** — a lightweight, reusable async-state wrapper (`isLoading` / `data` / `error` / `execute`) that standardizes calling any Server Action from a Client Component, with automatic toast-based error surfacing via `sonner`. This single hook replaces the boilerplate that React Query or SWR would otherwise add, since Server Actions already provide a server-trusted data boundary.
- **Local UI state** (modals, active tabs, form inputs, optimistic save/unsave flags) is managed with plain `useState`/`useEffect`, scoped to the component that owns it — keeping state colocated with the UI that consumes it and avoiding prop-drilling or global store overhead for a data set this size.

This approach trades the caching sophistication of TanStack Query for simplicity and fewer dependencies — an appropriate trade-off at the current scale, with a clear upgrade path (see [Future Improvements](#-future-improvements)).

## 🧠 Business Logic Highlights

| Logic                                | Implementation Detail                                                                                                                                                                                                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Freemium tier enforcement**        | `subscriptionTier` is resolved from Clerk's billing entitlement (`has({ plan: "pro_user" })`) on every `checkUser()` call and kept in sync with Strapi via a conditional `PUT` only when the tier actually changes — avoiding unnecessary writes.             |
| **AI generation cost control**       | `getOrGenerateRecipe` always checks Strapi for an existing, case-insensitive title match before invoking Gemini, and normalizes user input (`normalizeTitle`) so "pasta carbonara" and "Pasta Carbonara" resolve to the same cached record.                   |
| **Structured AI output contracts**   | Gemini is prompted with explicit JSON schemas and `responseMimeType: "application/json"`, with a defensive Markdown-fence stripper and `try/catch` JSON parse — gracefully surfacing a retry-prompting error instead of crashing on malformed model output.   |
| **Enum safety net**                  | AI-returned `category`/`cuisine` values are validated against the same allow-lists defined in the Strapi schema, with safe fallbacks (`"dinner"`, `"other"`) — guaranteeing the database never receives an out-of-range enum from a non-deterministic source. |
| **Idempotent collection management** | `saveRecipeToCollection` checks for an existing join record before creating a new one, returning `alreadySaved: true` rather than creating duplicate saves.                                                                                                   |
| **Just-in-time user provisioning**   | New Clerk users are transparently materialized as Strapi users on first authenticated action, fetching the default "authenticated" role dynamically rather than hardcoding a role ID.                                                                         |

---

## 🚀 Deployment Strategy

The codebase is structured for a **split deployment** matching its two-service architecture:

| Service          | Recommended Target                                                                                                    | Why                                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `servd-frontend` | **Vercel**                                                                                                            | First-class Next.js App Router + Server Actions support, automatic edge middleware deployment, image optimization CDN        |
| `servd-backend`  | **Strapi Cloud** (via bundled `@strapi/plugin-cloud`) or any Node host with managed PostgreSQL (Railway, Render, AWS) | The codebase already ships the `strapi deploy` script and cloud plugin; PostgreSQL config is production-ready out of the box |

## 🔧 Environment Setup

### `servd-frontend/.env.local`

```env
# Strapi Backend
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token

# Clerk Authentication & Billing
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Google Gemini (AI vision + recipe generation)
GEMINI_API_KEY=your_gemini_api_key

# Unsplash (recipe imagery for AI-generated dishes)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Arcjet (bot detection, shielding, rate limiting)
ARCJEY_KEY=your_arcjet_site_key
```

### `servd-backend/.env`

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS="generate,four,random,keys"
API_TOKEN_SALT=generate_a_random_salt
ADMIN_JWT_SECRET=generate_a_random_secret
TRANSFER_TOKEN_SALT=generate_a_random_salt
JWT_SECRET=generate_a_random_secret
ENCRYPTION_KEY=generate_a_random_key

# Database (defaults to SQLite if unset — set these for Postgres/MySQL)
DATABASE_CLIENT=postgres
DATABASE_URL=postgres://user:password@host:5432/servd
```

## 💻 Getting Started

### Prerequisites

- Node.js `>=20.x`
- npm `>=6.x`
- A PostgreSQL instance (or rely on the SQLite default for local development)
- API keys for Clerk, Google Gemini, Unsplash, and Arcjet

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd servd-ai-recipe-platform

# 2. Install and start the backend
cd servd-backend
npm install
cp .env.example .env   # then fill in the generated secrets
npm run develop         # Strapi admin available at http://localhost:1337/admin

# 3. In a new terminal, install and start the frontend
cd ../servd-frontend
npm install
# create .env.local using the template above
npm run dev              # App available at http://localhost:3000
```

### First-Run Setup (Strapi Admin)

1. Visit `http://localhost:1337/admin` and create your first super-admin account.
2. Under **Settings → API Tokens**, generate a **Full Access** token and place it in `servd-frontend/.env.local` as `STRAPI_API_TOKEN`.
3. Under **Settings → Roles → Authenticated**, ensure CRUD permissions are enabled for `Recipe`, `Pantry Item`, and `Saved Recipe` content types.

---

## 📜 Available Scripts

### Frontend (`servd-frontend`)

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build             |
| `npm run lint`  | Run ESLint across the codebase       |

### Backend (`servd-backend`)

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run develop` | Start Strapi in development mode with auto-reload |
| `npm run start`   | Start Strapi in production mode                   |
| `npm run build`   | Build the Strapi admin panel                      |
| `npm run console` | Open the Strapi interactive console               |
| `npm run deploy`  | Deploy to Strapi Cloud                            |

## 📚 Learning Outcomes

Building Servd involved hands-on, production-style experience with:

- Designing a **Server-Actions-as-API** architecture in the Next.js App Router, eliminating redundant API route boilerplate.
- Prompt-engineering an LLM for **reliable structured JSON output** and defensively validating non-deterministic AI responses before persistence.
- Implementing **tiered, server-enforced rate limiting** to make a freemium AI product commercially sustainable.
- Modeling a **relational content schema** in a headless CMS and integrating it with an external identity provider (Clerk) via a custom field bridge (`clerkId`).

---

<div align="center">Made with 🧡 by Jyothika</div>
