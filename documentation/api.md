Below is a **clean, exact list of PAGES and APIs**, written in a **reviewer-friendly format**.
You can **paste this directly into README.md**.

---

# Pages & APIs

## 1. Frontend Pages (Next.js – App Router)

### Public Pages

#### `/`

**Landing Page**

* Purpose: Introduce platform value
* Key elements:

  * Animated hero section
  * Value proposition
  * CTA: “Explore Deals”
* Animations:

  * Page load animation
  * CTA hover effects

---

#### `/login`

**Login Page**

* Purpose: Authenticate existing users
* Features:

  * Email & password login
  * JWT issued on success
  * Redirect to `/deals`

---

#### `/register`

**Register Page**

* Purpose: Create a new user
* Features:

  * Name, email, password
  * Default user is unverified
  * Redirect to `/deals`

---

### Authenticated Pages

#### `/deals`

**Deals Listing Page**

* Purpose: Browse all available deals
* Features:

  * List of deals (cards)
  * Filters by:

    * Category
    * Locked / Unlocked
  * Search functionality
* UI Behavior:

  * Locked deals visually restricted
  * Smooth hover & layout transitions

---

#### `/deals/[id]`

**Deal Details Page**

* Purpose: View full deal information
* Features:

  * Deal description
  * Partner information
  * Eligibility conditions
  * Claim button
* Logic:

  * Claim button disabled if user not eligible
  * Shows reason if deal is locked

---

#### `/dashboard`

**User Dashboard**

* Purpose: Track claimed deals
* Features:

  * User profile info
  * List of claimed deals
  * Claim status:

    * pending
    * approved
* UI:

  * Loading skeletons
  * Status badges

---

## 2. Backend APIs (REST)

### Authentication APIs

#### `POST /api/auth/register`

* Purpose: Register new user
* Request:

```json
{
  "name": "John Doe",
  "email": "john@email.com",
  "password": "password123"
}
```

* Response:

```json
{
  "token": "jwt_token"
}
```

---

#### `POST /api/auth/login`

* Purpose: Login existing user
* Request:

```json
{
  "email": "john@email.com",
  "password": "password123"
}
```

* Response:

```json
{
  "token": "jwt_token"
}
```

---

### Deal APIs

#### `GET /api/deals`

* Purpose: Fetch all deals
* Access: Public
* Response:

```json
[
  {
    "_id": "dealId",
    "title": "AWS Credits",
    "category": "Cloud",
    "isLocked": true
  }
]
```

---

#### `GET /api/deals/:id`

* Purpose: Fetch single deal details
* Access: Public
* Response:

```json
{
  "_id": "dealId",
  "title": "AWS Credits",
  "description": "...",
  "eligibilityText": "...",
  "isLocked": true
}
```

---

### Claim APIs (Protected)

#### `POST /api/claims`

* Purpose: Claim a deal
* Access: JWT required
* Request:

```json
{
  "dealId": "dealId"
}
```

* Backend Checks:

  * User authenticated
  * Deal exists
  * Deal locked → user must be verified

* Response:

```json
{
  "status": "pending"
}
```

---

#### `GET /api/claims/my`

* Purpose: Fetch logged-in user’s claimed deals
* Access: JWT required
* Response:

```json
[
  {
    "deal": "AWS Credits",
    "status": "pending"
  }
]
```

---

## 3. Page ↔ API Mapping

| Page          | APIs Used                                |
| ------------- | ---------------------------------------- |
| `/login`      | `POST /api/auth/login`                   |
| `/register`   | `POST /api/auth/register`                |
| `/deals`      | `GET /api/deals`                         |
| `/deals/[id]` | `GET /api/deals/:id`, `POST /api/claims` |
| `/dashboard`  | `GET /api/claims/my`                     |

---

## 4. Access Control Summary

| Action                         | Auth Required |
| ------------------------------ | ------------- |
| View deals                     |               |
| View deal details              |               |
| Claim deal                     |                 |
| View dashboard                 |                 |
| Claim locked deal (unverified) |               |

---

## 5. Why This Design Works

* Simple REST APIs
* Clear separation of concerns
* Easy to explain under review
* Minimal surface area for bugs
* Perfect for short deadline delivery

