# 🎯 START HERE - Fix Everything in 2 Minutes

## The Problem
Your console shows: **"Could not find the table 'public.reviews'"**

This breaks both shop page and product pages.

---

## ⚡ THE FIX (2 Steps)

### Step 1: Run SQL (1 minute)

1. Open https://supabase.com/dashboard
2. Click your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Open file: `RUN_THIS_FIX.sql`
6. Copy ALL contents (Ctrl+A, Ctrl+C)
7. Paste in Supabase
8. Click **RUN** (or F5)
9. Wait 5-10 seconds
10. You should see:
    - Table counts (PRODUCTS: 7, REVIEWS: 0, PROFILES: 0)
    - List of policies
    - List of 7 products

### Step 2: Restart Server (30 seconds)

```powershell
# In your terminal, press Ctrl+C
# Then run:
npm run dev
```

---

## ✅ Test It

1. Go to: http://localhost:5173/shop
2. You should see **7 products** in a grid
3. Click any product → should open detail page
4. No errors in console

---

## 🎉 That's It!

If you see products, you're done!

If not, check console for errors and share them.

---

## What The SQL Does

- ✅ Creates missing `reviews` table
- ✅ Creates missing `profiles` table
- ✅ Sets up proper RLS policies for public access
- ✅ Grants permissions to anonymous users
- ✅ Ensures all 7 products exist
- ✅ Creates performance indexes
- ✅ Verifies everything works

---

## Files You Need

1. **RUN_THIS_FIX.sql** ← Run this in Supabase
2. This file (START_HERE.md) ← You're reading it

That's all!
