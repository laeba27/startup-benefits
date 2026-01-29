# Dashboard Documentation

## Overview

The Dashboard is the central hub where authenticated users can view their profile information, track claimed deals, and manage their account. It provides a comprehensive overview of user activity and deal status.

---

## Dashboard Features

### 1. User Profile Section
- **Display user information:**
  - Name
  - Email
  - Phone (if provided)
  - Company (if provided)
  - Role/Title (if provided)
  - Verification status

---

#     Dashboard Component Structure

## 📁 App Router Pages

```txt
app/
└── dashboard/
    ├── layout.tsx              # Dashboard layout wrapper (sidebar + header)
    ├── page.tsx                # Dashboard home (overview)
    │
    ├── profile/
    │   └── page.tsx            # Profile management page
    │
    └── claims/
        └── page.tsx            # Claimed deals list page
```

---

#     Layout Level Components

These are shared across all dashboard pages.

```txt
components/dashboard/layout/
├── DashboardShell.tsx          # Main dashboard container
├── DashboardSidebar.tsx        # Left navigation
├── DashboardHeader.tsx         # Top bar (user + logout)
├── DashboardNavItem.tsx        # Sidebar nav link item
└── DashboardContent.tsx        # Content wrapper
```

---

## Dashboard Layout Flow

```
DashboardLayout
 ├── Sidebar
 ├── Header
 └── Content Area (renders page children)
```

---

#     Dashboard Home Components

Used in `/dashboard`

```txt
components/dashboard/home/
├── UserSummaryCard.tsx         # Name, email, startup, badge
├── VerificationCard.tsx        # Verified / not verified panel
├── StatsCard.tsx               # Small metric cards
├── QuickActions.tsx            # Explore deals / complete profile buttons
├── RecentClaimsList.tsx        # Last few claims preview
└── EmptyClaimsState.tsx        # Empty UI if no claims
```

---

## Dashboard Home Visual Tree

```
DashboardHomePage
 ├── UserSummaryCard
 ├── VerificationCard
 ├── StatsRow
 │   ├── StatsCard
 │   ├── StatsCard
 ├── QuickActions
 └── RecentClaimsList OR EmptyState
```

---

#     Profile Page Components

Used in `/dashboard/profile`

```txt
components/dashboard/profile/
├── ProfileForm.tsx             # Main form
├── ProfileField.tsx            # Reusable input row
├── StartupInfoSection.tsx      # Startup-specific fields
├── ContactInfoSection.tsx      # Phone / website
└── SaveProfileButton.tsx
```

---

## Profile Page Tree

```
ProfilePage
 └── ProfileForm
     ├── ProfileField
     ├── StartupInfoSection
     ├── ContactInfoSection
     └── SaveButton
```

---

#     Claimed Deals Page Components

Used in `/dashboard/claims`

```txt
components/dashboard/claims/
├── ClaimsList.tsx              # List wrapper
├── ClaimCard.tsx               # Individual claimed deal
├── ClaimStatusBadge.tsx        # Pending / approved badge
├── ClaimMetaRow.tsx            # Date + partner row
└── ClaimsEmptyState.tsx
```

---

## Claims Page Tree

```
ClaimsPage
 └── ClaimsList
     ├── ClaimCard
     │   ├── Title
     │   ├── Partner
     │   ├── ClaimMetaRow
     │   └── StatusBadge
     └── ClaimCard...
```

---

#     Shared UI Components (Reuse)

```txt
components/ui/
├── Card.tsx
├── Badge.tsx
├── Button.tsx
├── Input.tsx
├── Skeleton.tsx
└── Loader.tsx
```

Used across dashboard pages.

---

#     Auth Protection Layer

```txt
components/auth/
└── AuthGuard.tsx               # Protects dashboard routes
```

Usage:

* Wrap dashboard layout
* Redirect if no JWT

---

#     Data Hooks

```txt
hooks/
├── useUser.ts                  # Fetch current user
├── useClaims.ts                # Fetch claimed deals
└── useProfileUpdate.ts         # Profile mutation
```

---

#     API Layer Used by Dashboard

```txt
lib/
├── api.ts                      # Axios/fetch client
├── dashboard.api.ts            # Dashboard endpoints
└── claims.api.ts               # Claim endpoints
```

---

#     Minimal Build Version (If Time Is Tight)

If you must compress:

```
dashboard/
 ├── layout
 ├── page
 ├── profile/page
 └── claims/page
```

Components:

```
UserSummaryCard
VerificationCard
ClaimCard
ProfileForm
```

That’s enough to pass review.

---

#     Reviewer-Ready Explanation

> The dashboard is structured using a layout shell with sidebar and header, and feature-scoped component groups for overview, profile management, and claimed deals tracking. This keeps responsibilities isolated and supports scalability.

---

