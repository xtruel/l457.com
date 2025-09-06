# Firebase Authentication Fix Guide

## Issue: "The requested action is invalid" Error

This error occurs when trying to sign in with Google because the domain is not properly authorized in Firebase Authentication.

## Root Cause

The Firebase project is hosted at `l457-4444.web.app` but this domain is not added to the authorized domains list in Firebase Authentication settings.

## Solution Steps

### 1. Add Authorized Domains in Firebase Console

**CRITICAL: You must manually add these domains in Firebase Console:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `l457-4444`
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain** and add each of these domains:
   - `l457-4444.web.app` (Firebase hosting URL)
   - `l457-4444.firebaseapp.com` (Firebase auth domain)
   - `localhost` (for local development)
   - `l457.com` (if using custom domain)

### 2. Verify Google Sign-in Provider

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Ensure **Google** provider is enabled
3. Verify the support email is set

### 3. Check OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `l457-4444`
3. Navigate to **APIs & Services** → **Credentials**
4. Find the OAuth 2.0 client ID created by Firebase
5. Add authorized domains:
   - `l457-4444.web.app`
   - `l457-4444.firebaseapp.com`

### 4. Alternative: Use Firebase CLI (if available)

```bash
# This command may not be available in all Firebase CLI versions
firebase auth:domains:add l457-4444.web.app
firebase auth:domains:add l457-4444.firebaseapp.com
```

## Current Configuration

- **Project ID**: l457-4444
- **Auth Domain**: l457-4444.firebaseapp.com
- **Hosting URL**: https://l457-4444.web.app
- **Local Admin Password**: admin123

## Testing After Fix

1. Visit: https://l457-4444.web.app/#admin
2. Try Google Sign-in - should work without "invalid action" error
3. Local password should also work (password: admin123)

## Important Notes

- Domain authorization changes may take a few minutes to propagate
- Clear browser cache if issues persist
- The error "The requested action is invalid" specifically indicates unauthorized domain
- Both `.web.app` and `.firebaseapp.com` domains should be authorized

## Manual Steps Required

**⚠️ IMPORTANT: These steps must be done manually in Firebase Console:**

1. **Firebase Console** → Authentication → Settings → Authorized domains → Add:
   - `l457-4444.web.app`
   - `l457-4444.firebaseapp.com`

2. **Google Cloud Console** → APIs & Services → Credentials → OAuth client → Add:
   - `l457-4444.web.app`
   - `l457-4444.firebaseapp.com`

## Quick Links

- [Firebase Console - l457-4444](https://console.firebase.google.com/project/l457-4444)
- [Google Cloud Console - l457-4444](https://console.cloud.google.com/apis/credentials?project=l457-4444)
- [Live Site Admin Panel](https://l457-4444.web.app/#admin)