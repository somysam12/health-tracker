# Neon Database Quick Setup Guide

## Problem
Vercel par website kuch record nahi kar rahi kyunki database me tables nahi hain.

## Solution
Neon SQL Editor me ye SQL run karein:

---

## Step 1: Neon Console Kholen
1. https://console.neon.tech par jayein
2. Apna project select karein
3. "SQL Editor" tab par click karein

---

## Step 2: Ye SQL Copy Karke Run Karein

File dekhen: **NEON_DB_SETUP.sql**

Isme ye sab kuch hai:
- ✅ 5 tables (user_profiles, health_metrics, exercises, foods, heart_tips)
- ✅ 12 exercises (walking, swimming, yoga, etc.)
- ✅ 12 heart-healthy foods (salmon, oatmeal, blueberries, etc.)
- ✅ 12 heart health tips
- ✅ 1 default user profile

---

## Step 3: Verify Setup

Script run hone ke baad, ye query run karein:

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Aapko 5 tables dikhni chahiye:
1. user_profiles
2. health_metrics  
3. exercises
4. foods
5. heart_tips

---

## Step 4: Vercel Environment Variable Check

Vercel dashboard me check karein:

**Settings → Environment Variables**

```
Name: DATABASE_URL
Value: postgresql://user:password@host/database?sslmode=require
```

Ye environment variable **Production, Preview, AND Development** teeno me hona chahiye!

---

## Step 5: Redeploy on Vercel

Database setup hone ke baad:

1. Vercel dashboard → Your project
2. "Deployments" tab
3. Latest deployment ke bagal me "..." menu
4. "Redeploy" select karein

Ya simply GitHub me koi chhota change push karein (automatic deploy hoga).

---

## ✅ Test Karein

Deploy hone ke baad website test karein:

1. **BMI Calculator** - Height/weight enter karke "Calculate BMI" dabayein
2. **Step Tracker** - Steps enter karein  
3. **Heart Rate** - Heart rate record karein
4. **Blood Pressure** - BP readings enter karein

Agar sab kuch save ho raha hai, toh **database working hai!** ✅

---

## 🐛 Agar Error Aaye

### Error: "FUNCTION_INVOCATION_FAILED"

**Fix:**
1. Neon console me tables check karein: `SELECT * FROM user_profiles;`
2. Vercel me DATABASE_URL check karein
3. Vercel logs dekhein: Dashboard → Functions → Logs

### Error: "Connection timeout"

**Fix:**
1. Neon project settings → "Suspend after inactive period" disable karein
2. Database URL me `?sslmode=require` hai ya nahi check karein

### Error: "relation does not exist"

**Fix:**
- NEON_DB_SETUP.sql script dobara run karein
- Tables create hue ya nahi verify karein

---

## 📞 Support

Agar koi problem aaye toh:
1. Neon SQL Editor me error message dekhen
2. Vercel function logs check karein
3. Browser console (F12) me network errors dekhen

---

**Total Time:** 5-10 minutes for complete setup
