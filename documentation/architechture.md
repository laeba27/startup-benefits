Below is a **clear, explainable architecture** you can **paste directly into README.md**.
It is **simple, layered, and reviewer-friendly**, optimized for a **same-day submission**.

---

# System Architecture

## 1. Architecture Overview

The application follows a **client–server architecture** with a clear separation between:

* **Frontend**: Next.js (App Router) for UI, routing, and animations
* **Backend**: Node.js + Express for business logic and APIs
* **Database**: MongoDB for persistence
* **Auth**: JWT-based stateless authentication

```
[ Browser ]
     |
     |  HTTPS (REST APIs + JWT)
     v
[ Next.js Frontend ]
     |
     v
[ Express API Server ]
     |
     v
[ MongoDB ]
```

---

## 2. Frontend Architecture (Next.js)

### Pattern Used

**Page-driven architecture + reusable components**

### Responsibilities

* UI rendering
* Routing (App Router)
* Animations & transitions
* Form handling
* Auth state management
* API communication

### Layers

```
app/                → Routing & pages
components/         → Reusable UI & animation components
hooks/              → Auth & state logic
lib/                → API & helpers
types/              → TypeScript contracts
```

### Data Flow (Frontend)

1. Page loads
2. Calls backend API via `lib/api.ts`
3. JWT sent in headers (if authenticated)
4. Response updates local state
5. UI reacts with motion & transitions

---

## 3. Backend Architecture (Express)

### Pattern Used

**Layered (MVC-style) architecture**

### Layers

```
Routes        → Define endpoints
Controllers  → Handle request logic
Models       → Database schemas
Middleware   → Auth, validation, errors
Utils        → Helpers (JWT, hashing)
```

### Responsibility Split

| Layer       | Responsibility               |
| ----------- | ---------------------------- |
| Routes      | URL structure & HTTP methods |
| Controllers | Business rules               |
| Models      | Data structure & relations   |
| Middleware  | Auth & access control        |
| Utils       | Reusable logic               |

---

## 4. Authentication Architecture

### Strategy

* JWT-based authentication
* Stateless
* Token sent in `Authorization` header

### Flow

1. User logs in / registers
2. Backend validates credentials
3. JWT issued
4. Frontend stores token
5. Token attached to protected API calls
6. Backend middleware validates token

```
Request → Auth Middleware → Controller → Response
```

---

## 5. Authorization Rules

* Public users: can view unlocked deals
* Logged-in users: can view all deals
* **Unverified users**: cannot claim locked deals
* Verified users: can claim locked deals

Authorization logic is enforced **only on the backend**.

---

## 6. Core Business Logic Architecture

### Claim Deal Flow

```
User clicks Claim
     ↓
Frontend sends dealId + JWT
     ↓
Auth middleware validates user
     ↓
Controller checks:
  - Deal exists
  - Deal locked?
  - User verified?
     ↓
Claim created (status: pending)
     ↓
Response sent to frontend
```

---

## 7. Database Architecture

### Entities

```
User  ──┐
        ├── Claim ─── Deal
```

### Relationships

* One User → many Claims
* One Deal → many Claims
* Claim acts as a junction entity

Indexes:

* `Claim.userId`
* `Claim.dealId`

---

## 8. Frontend–Backend Interaction

* REST-based communication
* JSON request/response
* Centralized error handling
* Loading states handled in UI
* Skeleton screens for perceived performance

---

## 9. Animation & UX Architecture

### Principles

* Motion enhances clarity
* Minimal but intentional animations

### Implemented At:

* Page transitions
* Deal cards
* CTA buttons
* Loading states

Animation logic is isolated in:

```
components/animations/
```

---

## 10. Scalability & Extensibility

### Easy to Extend

* Add admin panel
* Add deal approval workflow
* Add pagination
* Add email notifications

### Why This Architecture Works

* Clear responsibility boundaries
* Easy to reason about
* Simple to test
* No over-engineering

---

## 11. Architectural Trade-offs

### Chosen

* REST over GraphQL (simplicity)
* JWT over sessions (stateless)
* Single backend service

### Deferred

* Role-based access
* Caching
* Background jobs

---

## 12. Summary

This architecture prioritizes:

* **Clarity over complexity**
* **Product flow over feature count**
* **Strong fundamentals under time constraints**

It is intentionally minimal, explainable, and aligned with the assignment evaluation criteria.

