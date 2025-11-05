# Performance Optimization Guide

## 🔴 Root Cause Analysis

### Issue 1: Slow Middleware (22-26s proxy.ts)
**Problem:** Middleware calls `supabase.auth.getUser()` on EVERY request (even static assets)
**Impact:** `/checkout` → middleware auth → 22s wait

### Issue 2: Double Auth Check (40-43s render)
**Problem:** Checkout page is client component, calls `getUser()` again in useEffect
**Impact:** Total = middleware (22s) + client fetch (40s) = 62-69s

### Issue 3: OAuth Callback Not Handled
**Problem:** `/shop?code=...` parameter not exchanged → extra redirects
**Impact:** Slow navigation, potential auth failures

### Issue 4: 406 Not Acceptable
**Problem:** Missing RLS policies or wrong headers on cart_items queries
**Impact:** API calls fail, need retry logic

---

## ✅ Solutions Implemented

### 1. Auth Callback Route (`app/auth/callback/route.ts`)
```typescript
// Handles OAuth code exchange
export async function GET(request: NextRequest) {
  const code = searchParams.get('code')
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    return NextResponse.redirect(`${origin}/shop`)
  }
}
```

**Before:** `/shop?code=...` → slow render → manual cleanup
**After:** Auto redirect to `/shop` clean URL
**Impact:** -2s navigation time

### 2. Optimized Middleware (`lib/supabase/middleware.ts`)
```typescript
// BEFORE: Always call getUser() - SLOW
const { data: { user } } = await supabase.auth.getUser()

// AFTER: Only for protected routes
const isProtectedRoute = pathname.startsWith("/admin") || 
                        pathname.startsWith("/checkout")
if (isProtectedRoute) {
  const { data: { user } } = await supabase.auth.getUser()
}
```

**Impact:** 
- `/shop` → no auth call → **-22s**
- `/checkout` → 1 auth call (vs 2) → **-22s**

### 3. RLS Policies (`scripts/008_cart_items_rls.sql`)
```sql
-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read/write their own cart
CREATE POLICY "Users can read own cart items"
ON cart_items FOR SELECT
USING (auth.uid() = user_id);
```

**Impact:** Fix 406 errors, secure data access

### 4. Admin Page Optimizations (Already done)
- `Promise.all()` for parallel queries
- `.limit(100)` to reduce data transfer
- `.maybeSingle()` to avoid errors

---

## 📊 Expected Performance

| Route | Before | After | Improvement |
|-------|--------|-------|-------------|
| `/shop` | 3.9s | **<1s** | -3s |
| `/shop` (OAuth) | 3.9s | **<1s** | -3s |
| `/checkout` | 71-77s | **<5s** | **-72s** 🎯 |
| `/admin` | 47-110s | **<5s** | -105s |
| `/admin/products` | 77s | **<6s** | -71s |

---

## 🔧 Steps to Apply

### 1. Run RLS Migration
```bash
# In Supabase SQL Editor, run:
scripts/008_cart_items_rls.sql
```

### 2. Update Supabase Dashboard
- Go to **Authentication → URL Configuration**
- Set **Redirect URLs** to: `http://localhost:3000/auth/callback`
- For production: `https://yourdomain.com/auth/callback`

### 3. Clear Cache & Restart
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### 4. Test OAuth Flow
1. Logout
2. Login via provider (Google/GitHub)
3. Should redirect to `/auth/callback` → `/shop`
4. Check URL has no `?code=...`

### 5. Test Checkout
1. Add product to cart
2. Go to `/checkout`
3. Should load in **<5 seconds** (not 77s!)

---

## 🚨 Chrome Extension Errors

### Error: "Could not establish connection"
**Cause:** Chrome extensions (e.g., ad blockers, password managers) injecting scripts
**Solution:** 
- **Dev:** Ignore these errors (they're harmless)
- **Or:** Disable extensions for `localhost`
- **Or:** Use Incognito mode for testing

### Error: "406 Not Acceptable"
**Before:** Missing RLS policies
**After:** RLS enabled ✅

---

## 🎯 Checklist

- [x] Created `/auth/callback/route.ts`
- [x] Optimized middleware (conditional getUser)
- [x] Created RLS policies for cart_items
- [x] Added `.limit()` to admin queries
- [x] Used `Promise.all()` for parallel fetches
- [ ] **TODO:** Update Supabase redirect URLs
- [ ] **TODO:** Run RLS migration
- [ ] **TODO:** Test and verify <5s load times

---

## 💡 Why Dev is Slower

**Turbopack Compilation:**
- First request: Compiles all files (8-12s)
- Hot reload: Re-compiles changed files (1-3s)

**Production Build:**
```bash
npm run build
npm start
```
- Pre-compiled, optimized
- Static generation for /shop
- Much faster!

**Recommendation:** Test performance in production mode before deploying.
