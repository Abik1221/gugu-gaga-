# Cookie Version Update Guide

When deploying updates that require invalidating cached authentication or user data:

## How It Works

The cookie versioning system automatically runs on every page load via `CookieVersionChecker` component in the root layout. It checks if the stored version matches the current `COOKIE_VERSION` constant.

## How to Force Users to Re-authenticate

1. **Open**: `front_end/utils/api.ts`
2. **Find**: The `COOKIE_VERSION` constant (around line 27)
3. **Update**: Increment the version number:
   ```typescript
   const COOKIE_VERSION = "v1.0.3"; // <- Change this
   ```
4. **Commit and Deploy**: Users will automatically be logged out and auth data cleared

## When to Update Version

Update `COOKIE_VERSION` when you:
- Change authentication logic or token structure
- Modify user data structure in localStorage
- Update routing/authorization system
- Make breaking changes to auth flow
- Want to force all users to re-authenticate

## What Happens Automatically

When a user loads the app with a new version:
1. `CookieVersionChecker` runs immediately on page load
2. `checkAuthVersion()` compares stored version with `COOKIE_VERSION`
3. If mismatch detected:
   - Clears all localStorage auth data (preserves `cookie-consent` and `theme`)
   - Clears auth cookies (`access_token`, `refresh_token`, `token`)
   - Sets new version in localStorage
   - User redirected to login

## Current Implementation

- **Version Constant**: `utils/api.ts` → `COOKIE_VERSION`
- **Check Function**: `utils/api.ts` → `checkAuthVersion()`
- **Auto-Runner**: `components/providers/cookie-version-checker.tsx`
- **Integrated In**: `app/layout.tsx` (runs on every page load)

This ensures users always have valid, up-to-date authentication data after deployments!
