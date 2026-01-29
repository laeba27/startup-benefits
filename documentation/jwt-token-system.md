# JWT Token System Documentation

## Overview

The backend now implements a professional JWT session management system with:
- **Access Token** (short-lived, 1 hour)
- **Refresh Token** (long-lived, 7 days)  
- **Magic Link Token** (very short-lived, 15 minutes)

This is a standard authentication pattern used by major companies like Google, GitHub, and Twitter.

---

## Token Types

### 1. Access Token (1 hour)
- **Purpose**: Used to authenticate API requests
- **Lifetime**: 1 hour
- **Usage**: Include in every API call in the `Authorization` header
- **When to Use**: All protected endpoints (/api/dashboard/*, /api/auth/profile, etc.)

### 2. Refresh Token (7 days)
- **Purpose**: Used to get a new access token when the current one expires
- **Lifetime**: 7 days
- **Usage**: Sent only to `/api/auth/refresh` endpoint
- **Storage**: Store in secure HTTP-only cookie or localStorage

### 3. Magic Link Token (15 minutes)
- **Purpose**: Used for passwordless authentication via email
- **Lifetime**: 15 minutes
- **Usage**: Sent in magic link URL: `/auth/verify?token={magicLinkToken}`
- **One-time Use**: Used once to verify email and get tokens

---

## Authentication Flow

### Step 1: User Requests Magic Link
```http
POST /api/auth/magic-link
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Magic link sent to your email",
  "devToken": "eyJhbGc..." // (development only)
}
```

**What Happens:**
- Magic link token is generated
- Email is sent with magic link
- In development, token is also returned in response

### Step 2: User Verifies Magic Link
**Frontend:** User clicks magic link in email or pastes token

```http
POST /api/auth/verify
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "isVerified": true,
      "profile": { ... }
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 3600,
      "tokenType": "Bearer"
    }
  }
}
```

**What Happens:**
- Magic link token is verified
- User is marked as verified
- **Access token and refresh token are generated and returned**
- User is now authenticated

### Step 3: Use Access Token for API Calls

```http
GET /api/dashboard
Authorization: Bearer eyJhbGc... (accessToken from Step 2)
```

**All protected endpoints require this header.**

### Step 4: When Access Token Expires (Optional)

If access token expires:
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..." (refresh token from Step 2)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGc...", // NEW access token
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

**What Happens:**
- Refresh token is verified
- New access token is generated
- User can continue making API calls with new token
- Refresh token remains valid until its 7-day expiration

---

## Frontend Implementation Guide

### 1. Store Tokens (After Verification)

```javascript
// After /api/auth/verify response
const { accessToken, refreshToken } = response.data.tokens;

// Store in localStorage
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('tokenExpiresAt', Date.now() + 3600000); // 1 hour
```

### 2. Use Access Token in API Calls

```javascript
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const accessToken = localStorage.getItem('accessToken');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(
    `http://localhost:8080/api${endpoint}`,
    options
  );
  
  return response.json();
};

// Usage
const dashboard = await apiCall('/dashboard', 'GET');
const profile = await apiCall('/auth/profile', 'GET');
```

### 3. Handle Token Expiration (Auto-Refresh)

```javascript
const apiCallWithRefresh = async (endpoint, method = 'GET', body = null) => {
  let accessToken = localStorage.getItem('accessToken');
  const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
  
  // Check if token expired (with 5-minute buffer)
  if (Date.now() > (tokenExpiresAt - 300000)) {
    // Token expired, refresh it
    const refreshToken = localStorage.getItem('refreshToken');
    
    const refreshResponse = await fetch(
      'http://localhost:8080/api/auth/refresh',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      }
    );
    
    const refreshData = await refreshResponse.json();
    
    if (refreshData.success) {
      accessToken = refreshData.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('tokenExpiresAt', Date.now() + 3600000);
    } else {
      // Refresh failed, user needs to login again
      localStorage.clear();
      window.location.href = '/login';
      return;
    }
  }
  
  // Now make the actual API call
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  };
  
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(
    `http://localhost:8080/api${endpoint}`,
    options
  );
  
  return response.json();
};
```

### 4. Logout

```javascript
const logout = () => {
  // Remove tokens from storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresAt');
  localStorage.removeItem('user');
  
  // Redirect to login
  window.location.href = '/login';
};
```

---

## Testing in Postman

### Step 1: Get Magic Link Token
1. **POST** `http://localhost:8080/api/auth/magic-link`
2. **Headers:** `Content-Type: application/json`
3. **Body:**
```json
{
  "email": "test@example.com"
}
```
4. Copy `devToken` from response (development mode)

### Step 2: Verify Token
1. **POST** `http://localhost:8080/api/auth/verify`
2. **Headers:** `Content-Type: application/json`
3. **Body:**
```json
{
  "token": "paste_devToken_here"
}
```
4. Copy both `accessToken` and `refreshToken` from response

### Step 3: Test Protected Endpoint
1. **GET** `http://localhost:8080/api/dashboard`
2. **Headers:**
```
Authorization: Bearer paste_accessToken_here
Content-Type: application/json
```
3. Should return dashboard data

### Step 4: Test Refresh Token
1. **POST** `http://localhost:8080/api/auth/refresh`
2. **Headers:** `Content-Type: application/json`
3. **Body:**
```json
{
  "refreshToken": "paste_refreshToken_here"
}
```
4. Get new access token

---

## Token Payload Structure

### Access Token Payload
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "type": "access",
  "iat": 1672531200,
  "exp": 1672534800
}
```

### Refresh Token Payload
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "type": "refresh",
  "iat": 1672531200,
  "exp": 1680307200
}
```

### Magic Link Token Payload
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "type": "magic-link",
  "iat": 1672531200,
  "exp": 1672532100
}
```

---

## Error Handling

### Token Expired
```json
{
  "success": false,
  "message": "Access token has expired. Please use refresh token to get new access token."
}
```
**Action:** Use refresh token to get new access token

### Invalid Token
```json
{
  "success": false,
  "message": "Invalid token: jwt malformed"
}
```
**Action:** User needs to login again (get new magic link)

### Missing Authorization Header
```json
{
  "success": false,
  "message": "Access token required. Use: Authorization: Bearer {token}"
}
```
**Action:** Include proper Authorization header in request

---

## Security Best Practices

###     Do's
- Store refresh token in HTTP-only, secure cookie (server-side)
- Store access token in memory or secure session storage (frontend)
- Always include `Authorization: Bearer {token}` header
- Use HTTPS in production
- Check token expiration before making API calls
- Implement auto-refresh 5 minutes before expiration
- Validate token on server for every protected request

###   Don'ts
- Don't store tokens in plain localStorage (XSS vulnerable)
- Don't include tokens in URL parameters
- Don't log tokens in console (production)
- Don't use same secret for different token types
- Don't trust client-side token expiration only
- Don't send tokens in query strings

---

## Environment Variables

Set these in `.env` file (backend):

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production

# Token Expiration Times
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
MAGIC_LINK_EXPIRES_IN=15m

# Frontend URL (for magic links)
FRONTEND_URL=http://localhost:3000
```

---

## API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/register` | POST |   | Create new user |
| `/api/auth/magic-link` | POST |   | Send magic link email |
| `/api/auth/verify` | POST |   | Verify token & get tokens |
| `/api/auth/refresh` | POST |   | Get new access token |
| `/api/auth/profile` | GET |     | Get user profile |
| `/api/auth/profile` | PATCH |     | Update profile |
| `/api/auth/logout` | POST |     | Logout user |
| `/api/dashboard` | GET |     | Get dashboard data |
| `/api/dashboard/profile` | GET |     | Get dashboard profile |
| `/api/deals` | GET |   | Get all deals |

---

## Troubleshooting

### "Invalid token" Error
- **Cause:** Token is malformed or corrupted
- **Solution:** Get new magic link token

### "Token has expired" Error
- **Cause:** Token lifetime exceeded
- **Solution:** Use refresh token to get new access token

### "User not found" Error
- **Cause:** User deleted or token has wrong userId
- **Solution:** Logout and login again

### "Access token required" Error
- **Cause:** Missing Authorization header
- **Solution:** Add `Authorization: Bearer {accessToken}` to request headers

---

## Next Steps

1. Update frontend login/register pages to handle token response
2. Create a token management service in frontend
3. Add token refresh interceptor to fetch calls
4. Implement logout functionality
5. Add token expiration warnings to UI
6. Test all flows in Postman before frontend integration
