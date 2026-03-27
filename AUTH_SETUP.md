# Google OAuth Authentication Setup

## Frontend Implementation Complete ✓

The frontend has been fully configured with Google OAuth authentication. Here's what's been implemented:

### 1. **Authentication Context** (`context/AuthContext.tsx`)
- Manages authentication state globally
- Stores access token, refresh token, user email, and user name in localStorage
- Provides `useAuth` hook for accessing auth state throughout the app
- Automatically initializes from localStorage on app startup
- Includes token refresh logic

### 2. **API Client** (`lib/api-client.ts`)
- Handles all API requests with automatic token attachment
- Implements token refresh on 401 responses
- Redirects to login if refresh fails
- Exports `getGoogleLoginUrl()` helper

### 3. **Login Page** 
- Main landing page (`app/page.tsx`) now serves as login when unauthenticated
- Shows login UI with "Sign in with Google" button
- Redirects authenticated users to dashboard automatically
- Shows loading state while auth initializes

### 4. **OAuth Callback Handler** (`app/auth/callback/page.tsx`)
- Handles redirect from backend after Google login
- Extracts tokens from URL parameters
- Stores tokens in context and localStorage
- Redirects to dashboard on successful auth

### 5. **Protected Routes**
- `ProtectedRoute` component wraps authenticated-only pages
- Applied to: `/transactions`, `/analytics`, `/settings`
- Automatically redirects unauthenticated users to login

### 6. **Navigation Updates**
- Updated navbar with logout button and user info display
- Bottom nav only shows when authenticated
- Logout clears tokens and redirects to login

## Backend Configuration Required

Your backend needs to:

### 1. **Login Endpoint** (GET `/auth/login`)
- Redirect to Google OAuth consent screen
- Example redirect: `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:8000/auth/callback&response_type=code&scope=email+profile`

### 2. **Callback Endpoint** (GET `/auth/callback`)
- Receive `code` parameter from Google
- Exchange code for access token with Google
- Generate JWT tokens (access_token + refresh_token)
- **IMPORTANT**: Redirect to frontend with tokens as URL parameters:
  ```
  http://localhost:3000/auth/callback?access_token=JWT_TOKEN&refresh_token=REFRESH_TOKEN&email=user@gmail.com&name=User%20Name
  ```

### 3. **Refresh Token Endpoint** (POST `/auth/refresh`)
- Accept `refresh_token` in request body
- Return new `access_token`
- Response format:
  ```json
  {
    "access_token": "new_jwt_token"
  }
  ```

## Token Format

Tokens should be JWT format with:
- **access_token**: Short-lived JWT (15-30 min expiration)
- **refresh_token**: Long-lived JWT or opaque token (7 days+ expiration)
- Include user info in JWT: `{email, name, user_id, ...}`

## Storage

- **access_token**: localStorage key `access_token`
- **refresh_token**: localStorage key `refresh_token`
- **user_email**: localStorage key `user_email`
- **user_name**: localStorage key `user_name`

## API Requests

All authenticated API requests include:
```
Authorization: Bearer {access_token}
```

Example:
```javascript
// Using ApiClient (recommended)
import { ApiClient } from '@/lib/api-client'
const data = await ApiClient.get('/gmail/get_amount')

// Direct fetch
const response = await fetch('http://localhost:8000/gmail/get_amount', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
```

## Environment Variables

Add to `.env.local` if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Testing the Flow

1. Start frontend: `npm run dev` (http://localhost:3000)
2. Click "Sign in with Google" button
3. You'll be redirected to: `http://localhost:8000/auth/login`
4. After Google auth, you'll return to: `http://localhost:3000/auth/callback?access_token=...&refresh_token=...`
5. Tokens are extracted and stored
6. Dashboard loads automatically

## Logout

- Logout button clears tokens from localStorage and context
- Redirects user to login page
- All authenticated routes check for valid token

## Security Notes

- Tokens stored in localStorage (consider upgrading to SessionStorage for sensitive apps)
- Token validation should happen on backend for each request
- Implement proper CORS headers on backend
- Use HTTPS in production
- Set appropriate token expiration times
- Consider implementing refresh token rotation

## Troubleshooting

**Issue**: "No access token received"
- Check backend is sending tokens as URL parameters
- Verify callback URL matches: http://localhost:3000/auth/callback

**Issue**: Token not persisting
- Check localStorage is enabled
- Verify no browser extensions blocking storage

**Issue**: 401 errors on API calls
- Token might be expired
- Implement token refresh if not working
- Check token format matches backend expectations

**Issue**: Redirect loop
- Check auth context initialization
- Verify tokens are correctly parsed from URL
