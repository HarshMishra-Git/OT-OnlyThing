# 🔑 How to Get Your Supabase Anon Key

## Quick Steps:

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard/project/wtrfskkboddmxnhzoknf

2. **Click "Settings" (gear icon)** in the left sidebar

3. **Click "API"** 

4. **Find "Project API keys" section**

5. **Copy the `anon` `public` key** (NOT the service_role key!)

6. **Paste it in `.env` file** replacing `YOUR_ANON_KEY_HERE`

---

## Your `.env` file should look like:

```
VITE_SUPABASE_URL=https://wtrfskkboddmxnhzoknf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (your actual anon key)
```

---

## After updating:

1. **Stop your dev server** (Ctrl+C)
2. **Run `npm run dev` again**
3. **The website will now connect to your new database!**

---

## Then run the SQL to add products:

1. Go to SQL Editor in Supabase
2. Copy content from `ADD_PRODUCTS_NOW.sql`
3. Paste and run
4. Refresh website - you'll see all 7 colorful products!

✅ **Done!**
