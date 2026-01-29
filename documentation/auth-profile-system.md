# Complete Authentication & Profile System - Setup Summary

## What Has Been Implemented

### 1. **Token System (Backend)**
- **Access Token**: 1-hour validity for API calls
- **Refresh Token**: 7-day validity for refreshing access tokens
- **Magic Link Token**: 15-minute validity for email verification
- All tokens are JWT-based with proper signatures

### 2. **User Model Enhancements**
Added new fields to User schema:
- `adminVerified` (boolean, default: false) - For admin verification of users to access restricted deals
- Profile fields:
  - `address`: User's street address
  - `city`: City name
  - `state`: State/Province
  - `zipCode`: Postal code
  - `country`: Country name

### 3. **API Endpoints**

#### Authentication Endpoints (No Auth Required)
- `POST /api/auth/magic-link` - Send magic link to email
- `POST /api/auth/verify` - Verify magic link token → Returns `accessToken`, `refreshToken`, `expiresIn`
- `POST /api/auth/refresh` - Refresh access token using refresh token

#### Profile Endpoints (Bearer Auth Required)
- `GET /api/auth/profile` - Get user profile (includes `adminVerified` status)
- `PATCH /api/auth/profile` - Update profile with all new fields
  
**Bearer Token Format**: `Authorization: Bearer <accessToken>`

### 4. **Frontend Implementation**

#### Profile Page (`/dashboard/profile`)
- Fetch profile from `/api/auth/profile` using Bearer token
- Update profile with new address fields
- Display email verification status (✓ Verified)
- Display admin verification status with visual indicator
- All API calls use Bearer token from AuthContext

#### AuthContext Updates
- Store `accessToken` and `refreshToken` separately
- Added `refreshAccessToken()` method for token refresh
- Updated `login()` method to accept token pair: `login(accessToken, refreshToken, user)`

#### API Utility (`frontend/utils/api.ts`)
- Auto-injects Bearer token to all requests
- Auto-refreshes expired tokens
- Retries requests with new token if 401 received
- Clears tokens and redirects to login on auth failure

## Authentication Flow

```
1. User enters email on login page
   ↓
2. Magic link sent to email via /api/auth/magic-link
   ↓
3. User clicks link: http://localhost:3000/auth/verify?token=<magicToken>
   ↓
4. Frontend calls POST /api/auth/verify with magic token
   ↓
5. Backend verifies token and returns:
   {
     success: true,
     data: {
       user: { id, email, isVerified, adminVerified, profile },
       tokens: { accessToken, refreshToken, expiresIn, tokenType }
     }
   }
   ↓
6. Frontend calls: login(accessToken, refreshToken, user)
   ↓
7. AuthContext stores tokens in localStorage:
   - accessToken
   - refreshToken
   - user
   ↓
8. User automatically redirected to /deals dashboard
   ↓
9. All API calls include: Authorization: Bearer <accessToken>
```

## Admin Verification System

### For Admin Portal (Future):
- Set `adminVerified: true` on User model to grant access to restricted deals
- Users with `adminVerified: false` can see public deals only
- Users with `adminVerified: true` can see and claim restricted deals

### User Experience:
- Profile page shows admin verification status
- If not verified: "Pending admin verification for restricted deals"
- If verified: "✓ Your account has been verified by our admin team"

## Testing the API

### 1. Send Magic Link
```bash
curl -X POST http://localhost:8080/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

Response includes `devToken` and `devMagicLink` in development.

### 2. Verify Magic Link
```bash
curl -X POST http://localhost:8080/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"token": "<magicToken>"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 3600,
      "tokenType": "Bearer"
    }
  }
}
```

### 3. Get Profile (Requires Bearer Token)
```bash
curl -X GET http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer <accessToken>"
```

### 4. Update Profile (Requires Bearer Token)
```bash
curl -X PATCH http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }'
```

### 5. Refresh Token
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<refreshToken>"}'
```

## Files Modified/Created

### Backend
- `src/models/User.model.ts` - Added `adminVerified` and address fields
- `src/controllers/auth.controller.ts` - Updated getProfile and updateProfile
- `src/utils/tokenService.ts` - Token generation and verification (already created)
- `src/middleware/auth.middleware.ts` - Bearer token extraction and verification
- `src/routes/auth.routes.ts` - Routes already configured

### Frontend
- `contexts/AuthContext.tsx` - Updated to store accessToken and refreshToken
- `app/dashboard/profile/page.tsx` - Complete rewrite to fetch/update profile
- `utils/api.ts` - Created API utility with auto token injection
- `hooks/useAuth.ts` - Already uses updated context

## Next Steps

1.     Verify the full auth flow works in the browser
2.     Test profile update with new fields
3.     Verify admin verification status displays
4. Create admin dashboard for user verification
5. Add restricted deal support based on `adminVerified` status
6. Create deal claiming functionality
