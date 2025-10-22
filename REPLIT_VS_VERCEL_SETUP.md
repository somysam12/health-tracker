# Health Monitor - Replit vs Vercel Setup Guide

## 🎯 Current Status

### ✅ Replit (Local Development) - WORKING PERFECTLY
- Server running on port 5000
- Using **in-memory storage** (MemStorage)
- All features working:
  - Dashboard
  - BMI Calculator
  - Step Tracker
  - Heart Rate Monitor
  - Blood Pressure Tracker
  - Exercises & Foods lists
  - Heart Tips

### ❌ Vercel (Production) - NEEDS DATABASE SETUP
- Getting **405 Error** when trying to POST data
- Requires **PostgreSQL database** (Neon)
- Needs DATABASE_URL environment variable

---

## 🔍 Why are there TWO codebases?

### 1. Local Replit Code (`server/routes.ts`)
```
server/
  routes.ts       ← Express routes with in-memory storage
  storage.ts      ← MemStorage class (no database needed)
  index.ts        ← Main server file
```
**Purpose**: Quick development and testing on Replit without database

### 2. Vercel Deployment Code (`api/index.js`)
```
api/
  index.js        ← Serverless function for Vercel (needs database)
```
**Purpose**: Production deployment on Vercel with real database

---

## 🚀 How to Deploy to Vercel (Fix 405 Error)

### Step 1: Create Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project: "health-monitor"
3. Copy your **connection string**:
   ```
   postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Set Environment Variable in Vercel

1. Open your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon connection string
   - **Environments**: Check ALL (Production + Preview + Development)
4. Click **Save**

### Step 3: Initialize Database Tables

1. Open **Neon SQL Editor**
2. Run this SQL to create all tables:

```sql
-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(100) NOT NULL UNIQUE,
  height REAL NOT NULL,
  weight REAL NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Health Metrics Table
CREATE TABLE IF NOT EXISTS health_metrics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES user_profiles(id),
  steps INTEGER NOT NULL DEFAULT 0,
  heart_rate INTEGER NOT NULL,
  systolic_bp INTEGER,
  diastolic_bp INTEGER,
  date TIMESTAMP DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Exercises Table
CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT NOT NULL,
  duration VARCHAR(50) NOT NULL,
  intensity VARCHAR(20) NOT NULL,
  heart_health_rating INTEGER NOT NULL,
  calories_burned INTEGER
);

-- Foods Table
CREATE TABLE IF NOT EXISTS foods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT NOT NULL,
  calories INTEGER NOT NULL,
  nutrients TEXT NOT NULL,
  heart_healthy INTEGER NOT NULL
);

-- Heart Tips Table
CREATE TABLE IF NOT EXISTS heart_tips (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  importance VARCHAR(20) NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_date ON health_metrics(date DESC);
```

3. Click **Run** to execute

### Step 4: Deploy to Vercel

Two options:

**Option A: Automatic (if connected to GitHub)**
```bash
git add .
git commit -m "Fix Vercel deployment"
git push origin main
```
Vercel will auto-deploy (wait 1-2 minutes)

**Option B: Manual**
```bash
npm install -g vercel
vercel --prod
```

### Step 5: Test Your Deployment

1. Wait for deployment to finish (check Vercel dashboard)
2. Visit: `https://your-app.vercel.app/api/health`
   
   Should show:
   ```json
   {
     "status": "API is running",
     "database": {
       "configured": true,
       "message": "DATABASE_URL is set ✅"
     }
   }
   ```

3. Test BMI Calculator:
   - Go to `/bmi` page
   - Enter Height: 164, Weight: 45
   - Click "Calculate BMI"
   - Should work without 405 error! ✅

---

## 🐛 Troubleshooting

### Still getting 405 error?

**Check 1: Is DATABASE_URL set?**
```bash
# In Vercel → Settings → Environment Variables
# Make sure DATABASE_URL exists and is applied to all environments
```

**Check 2: Did you redeploy after setting DATABASE_URL?**
```bash
# In Vercel dashboard, go to Deployments tab
# Click "..." menu → "Redeploy"
```

**Check 3: Are database tables created?**
```bash
# Run the SQL script above in Neon SQL Editor
# Verify tables exist: user_profiles, health_metrics, exercises, foods, heart_tips
```

### Getting 503 error instead?

This means DATABASE_URL is not set. Follow Step 2 above.

### Getting 404 error?

Check your vercel.json routing:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index"
    }
  ]
}
```

---

## 📝 Summary

| Environment | Storage | Status | URL |
|------------|---------|--------|-----|
| **Replit** | In-Memory | ✅ Working | Port 5000 (development) |
| **Vercel** | PostgreSQL (Neon) | ⚠️ Needs Setup | your-app.vercel.app |

**To fix Vercel 405 error:**
1. ✅ Set DATABASE_URL in Vercel
2. ✅ Create database tables in Neon
3. ✅ Redeploy your app
4. ✅ Test the BMI calculator

---

## 💡 Pro Tips

1. **Local testing is working** - Use Replit for development
2. **Vercel needs database** - It won't work without DATABASE_URL
3. **405 vs 503**:
   - 405 = Routing issue OR missing database causing method problems
   - 503 = Database not configured (clearer error message)
4. **After any environment variable change** - Always redeploy!

---

## 🎉 Once Setup is Complete

Your app will work perfectly on both:
- ✅ **Replit**: Development with instant changes
- ✅ **Vercel**: Production with real database
- ✅ **All Features**: BMI, Steps, Heart Rate, BP, Exercises, Foods, Tips

Bas DATABASE_URL set karo aur database tables banao - phir sab kaam karega! 🚀
