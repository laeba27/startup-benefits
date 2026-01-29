Below is an **exact, minimal, submission-safe folder structure** optimized for a **6-hour deadline**.
This structure is **clean, explainable, and matches the assignment constraints**.

You can **copy this directly** and build on top of it.

---

## 📁 Project Root

```
startup-benefits-platform/
│
├── frontend/                     # Next.js Frontend
├── backend/                     # Express Backend
├── README.md                   # Mandatory documentation
└── .gitignore
```

---

## 📁 Frontend — Next.js (App Router)

```
frontend/
│
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│
│   ├── page.tsx                # Landing Page
│
│   ├── login/
│   │   └── page.tsx            # Login Page
│
│   ├── register/
│   │   └── page.tsx            # Register Page
│
│   ├── deals/
│   │   ├── page.tsx            # Deals Listing Page
│   │   └── [id]/
│   │       └── page.tsx        # Deal Details Page
│
│   ├── dashboard/
│   │   └── page.tsx            # User Dashboard
│
│   └── api/                    # (Optional) Route handlers if needed
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Loader.tsx
│   │   └── Skeleton.tsx
│   │
│   ├── deals/
│   │   ├── DealCard.tsx
│   │   └── DealFilter.tsx
│   │
│   └── animations/
│       ├── PageTransition.tsx
│       └── MotionWrapper.tsx
│
├── lib/
│   ├── api.ts                  # Axios / fetch wrapper
│   ├── auth.ts                 # JWT helpers
│   └── constants.ts
│
├── hooks/
│   └── useAuth.ts
│
├── types/
│   ├── deal.ts
│   ├── user.ts
│   └── claim.ts
│
├── public/
│   └── images/
│
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📁 Backend — Node + Express + MongoDB

```
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.ts               # MongoDB connection
│   │   └── env.ts
│   │
│   ├── models/
│   │   ├── User.model.ts
│   │   ├── Deal.model.ts
│   │   └── Claim.model.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── deal.controller.ts
│   │   └── claim.controller.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── deal.routes.ts
│   │   └── claim.routes.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT verification
│   │   └── error.middleware.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── hash.ts
│   │
│   ├── app.ts                  # Express app
│   └── backend.ts               # backend bootstrap
│
├── package.json
├── tsconfig.json
└── .env
```

---

## 📁 README.md (Root Level – Mandatory)

```
README.md
```

Contains:

* Application flow
* Auth logic
* Deal claiming logic
* Frontend ↔ backend interaction
* Limitations
* Production improvements
* UI & animation decisions

---

##     Why This Structure Is Perfect for the Assignment

* ✔ Clear **separation of concerns**
* ✔ Easy to explain in interview/review
* ✔ Scales without refactor
* ✔ No forbidden tech
* ✔ Matches evaluation criteria
* ✔ Fast to implement under pressure

---

## ⚠️ IMPORTANT (For 6-Hour Survival)

If short on time:

* Skip admin panel
* Skip pagination
* Hardcode some deal data initially
* Focus on **flow + animations + README**

Below is a **complete frontend + backend folder structure** with **inline comments explaining the purpose of every folder and key file**.
This is **submission-ready**, **easy to explain**, and aligned with what you described (JWT, email-based auth, animated landing).

You can treat this as **architecture + implementation guidance in one place**.

---

## 📁 Project Root

```txt
startup-benefits-platform/
│
├── frontend/            # Next.js frontend (App Router)
├── backend/            # Express backend (REST APIs)
├── README.md          # Project documentation (overview, flow, architecture)
└── .gitignore
```

---

# 📁 Frontend — `frontend/` (Next.js + TypeScript)

```txt
frontend/
│
├── app/                           # Next.js App Router (pages & layouts)
│   │
│   ├── layout.tsx                 # Root layout (fonts, global wrappers)
│   ├── globals.css                # Global styles & Tailwind base
│   │
│   ├── page.tsx                   # Landing page (animated hero, CTA)
│   │
│   ├── login/
│   │   └── page.tsx               # Email-based login page
│   │                               # User enters email to receive auth link
│   │
│   ├── register/
│   │   └── page.tsx               # Registration flow (post-auth profile)
│   │
│   ├── verify/
│   │   └── page.tsx               # Email verification page
│   │                               # Reads token from URL & verifies JWT
│   │
│   ├── dashboard/
│   │   └── page.tsx               # Protected route (after auth)
│   │
│   └── not-found.tsx              # Custom 404 page
│
├── components/                    # Reusable UI components
│   │
│   ├── layout/
│   │   ├── Navbar.tsx             # App navigation bar
│   │   └── Footer.tsx             # Footer component
│   │
│   ├── ui/
│   │   ├── Button.tsx             # Reusable button component
│   │   ├── Input.tsx              # Input fields
│   │   ├── Loader.tsx             # Loading spinner
│   │   └── Skeleton.tsx           # Skeleton loading UI
│   │
│   ├── animations/
│   │   ├── MotionWrapper.tsx      # Shared animation wrapper (Framer Motion)
│   │   ├── PageTransition.tsx     # Route transition animations
│   │   └── HeroAnimation.tsx      # Landing page hero animation
│   │
│   └── auth/
│       └── AuthGuard.tsx          # Protects routes using JWT check
│
├── hooks/
│   └── useAuth.ts                 # Handles auth state & token logic
│
├── lib/
│   ├── api.ts                     # Centralized API frontend (fetch / axios)
│   ├── auth.ts                    # JWT helpers (store, read, remove token)
│   └── constants.ts               # App constants (API base URL, routes)
│
├── types/
│   ├── user.ts                    # User TypeScript interface
│   └── auth.ts                    # Auth-related types
│
├── public/
│   └── images/                    # Static images, logos, icons
│
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript config
└── package.json                   # Frontend dependencies & scripts
```

---

# 📁 Backend — `backend/` (Node.js + Express + MongoDB)

```txt
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.ts                  # MongoDB connection setup
│   │   └── env.ts                 # Environment variable validation
│   │
│   ├── models/
│   │   └── User.model.ts          # User schema (email, verified, timestamps)
│   │                               #   No passwords stored
│   │
│   ├── controllers/
│   │   └── auth.controller.ts     # Auth logic:
│   │                               # - generate email token
│   │                               # - verify JWT
│   │                               # - issue access token
│   │
│   ├── routes/
│   │   └── auth.routes.ts         # Auth routes:
│   │                               # POST /auth/login
│   │                               # GET  /auth/verify
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts     # Verifies access JWT on protected routes
│   │   └── error.middleware.ts    # Centralized error handling
│   │
│   ├── services/
│   │   └── mail.service.ts        # Sends JWT login links via Gmail (SMTP)
│   │
│   ├── utils/
│   │   ├── jwt.ts                 # JWT sign & verify helpers
│   │   └── token.ts               # Token expiration & payload helpers
│   │
│   ├── app.ts                     # Express app setup (middlewares, routes)
│   └── backend.ts                  # backend entry point (listen on port)
│
├── .env                           # Environment variables
├── tsconfig.json                  # TypeScript config
└── package.json                   # Backend dependencies & scripts
```

---

# 🔑 How This Structure Supports Your Auth Flow

* **Frontend**

  * Landing → Login (email only)
  * Email verification page handles JWT from URL
  * Access token stored frontend-side
  * Protected routes guarded via `AuthGuard`

* **Backend**

  * Generates **email JWT** (short-lived)
  * Sends login link via Gmail
  * Verifies token → issues **access JWT**
  * No passwords stored anywhere

---

## Why reviewers will like this

* Clear separation of concerns
* Secure passwordless authentication
* Easy to explain folder-by-folder
* Scales naturally for next phases (deals, claims, dashboard)

---


