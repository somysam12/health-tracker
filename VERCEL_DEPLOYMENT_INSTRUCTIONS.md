# Vercel Deployment Instructions for Health Tracker

## Overview
This Health Tracker application is a full-stack web app with:
- **Frontend**: React + Vite
- **Backend**: Serverless API function at `/api`
- **Database**: PostgreSQL (Neon recommended)

## Prerequisites
- GitHub repository with your code pushed
- Vercel account (free tier works)
- Neon PostgreSQL database account (free tier available)

---

## Step 1: Set Up PostgreSQL Database

### Create a Neon Database (Recommended)
1. Go to [Neon Console](https://console.neon.tech/)
2. Click "Create Project"
3. Choose a name (e.g., "health-tracker-db")
4. Select a region close to your users
5. Click "Create Project"
6. Copy the **connection string** - it looks like:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
7. **Save this connection string** - you'll need it for Vercel

---

## Step 2: Push Database Schema to Your Database

Before deploying to Vercel, you need to create the database tables:

### Locally Set Up Environment
1. Create a `.env` file in your project root:
   ```bash
   echo "DATABASE_URL=your_neon_connection_string_here" > .env
   ```
   Replace `your_neon_connection_string_here` with the actual connection string from Step 1.

### Push Schema to Database
Run the following command to create all database tables:
```bash
npm run db:push
```

You should see output like:
```
✓ Pulling schema from database
✓ Changes applied
```

### Seed Initial Data (Optional but Recommended)
Populate your database with exercises, foods, and health tips:

```bash
# If the seed script exists in package.json
npm run seed

# Or run directly
npx tsx server/seed.ts
```

---

## Step 3: Deploy to Vercel

### Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Click "Import" next to your GitHub repository
4. If you don't see your repository:
   - Click "Adjust GitHub App Permissions"
   - Grant access to the repository

### Configure Project Settings

Vercel will auto-detect the framework. Verify these settings:

- **Framework Preset**: Vite
- **Build Command**: `vite build` (should be auto-detected from vercel.json)
- **Output Directory**: `dist/public` (should be auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Add Environment Variables (CRITICAL)

**Before deploying**, add your database connection string:

1. In the import screen, expand "Environment Variables"
2. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon connection string from Step 1
   - **Environments**: Check all boxes (Production, Preview, Development)
3. Click "Add"

### Deploy

1. Click "Deploy"
2. Wait 1-2 minutes for the build to complete
3. You'll see "Congratulations!" when deployment succeeds

---

## Step 4: Verify Deployment

### Test API Health Endpoint
Visit your deployed site's API health check:
```
https://your-project-name.vercel.app/api/health
```

You should see a JSON response like:
```json
{
  "status": "API is running",
  "timestamp": "2025-10-22T15:30:00.000Z",
  "database": {
    "configured": true,
    "urlLength": 181,
    "message": "DATABASE_URL is set ✅"
  }
}
```

If you see `"configured": false`, go back and add the DATABASE_URL environment variable.

### Test the Application

1. **Visit Your App**: `https://your-project-name.vercel.app`
2. **Test BMI Calculator**:
   - Click "Calculate BMI" from the dashboard
   - Enter height (e.g., 175 cm), weight (e.g., 70 kg), age, gender
   - Submit and verify BMI is calculated
3. **Test Step Tracking**:
   - Click "Log Steps"
   - Enter a number (e.g., 5000)
   - Verify the dashboard updates
4. **Test Heart Rate**:
   - Click "Check Heart Rate"
   - Enter a value (e.g., 75 bpm)
   - Verify it displays on the dashboard
5. **Test Other Features**:
   - Navigate to "Exercises" - should show a list
   - Navigate to "Healthy Foods" - should show food recommendations
   - Navigate to "Heart Tips" - should show health tips

---

## Troubleshooting

### Issue: 404 NOT_FOUND Error

**Symptoms**: Blank page or "404: NOT_FOUND" message

**Solutions**:
1. **Check DATABASE_URL is set**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify DATABASE_URL exists and is correct
   - If missing, add it and redeploy
2. **Redeploy**:
   - Go to Deployments tab
   - Click ⋯ (three dots) on latest deployment
   - Click "Redeploy"

### Issue: "Database not configured" Error

**Symptoms**: API returns error message about missing DATABASE_URL

**Solutions**:
1. Add DATABASE_URL to Vercel environment variables (see Step 3)
2. After adding, trigger a new deployment:
   - Push a small commit to GitHub, OR
   - Manually redeploy from Vercel dashboard

### Issue: Empty Lists (No Exercises/Foods/Tips)

**Symptoms**: Exercise, Food, or Heart Tips pages are empty

**Solutions**:
1. Run the seed script locally:
   ```bash
   # Make sure DATABASE_URL is set in .env
   npx tsx server/seed.ts
   ```
2. Verify data was inserted by checking your Neon database console

### Issue: "Profile not found" Errors

**Symptoms**: BMI shows "Profile not found. Please enter your height and weight."

**This is NORMAL** for first-time users. To fix:
1. Click "Calculate BMI"
2. Enter your profile information (height, weight, age, gender)
3. Submit the form
4. Your profile will be created and BMI calculated

---

## Architecture Overview

### How It Works on Vercel

```
User Request
     ↓
Vercel Edge Network
     ↓
  /api/* → Serverless Function (api/index.js)
     ↓
  Neon PostgreSQL Database

  /* → Static Frontend (dist/public/)
```

### Files Structure

- **Frontend Build**: `dist/public/` (generated by `vite build`)
- **API Function**: `api/index.js` (serverless function)
- **Database Schema**: `shared/schema.ts` (TypeScript) + `server/db/schema.ts`
- **Configuration**: `vercel.json` (Vercel deployment config)

**IMPORTANT**: The `vercel.json` file contains ordered rewrites that must be preserved:
1. First rewrite: `/api/:path*` passthrough (ensures API requests reach serverless function)
2. Second rewrite: `/:path*` to `/index.html` (SPA fallback for client-side routing)

Do not change the order of these rewrites, as it will break either API or SPA functionality.

### How API Routing Works

Vercel automatically maps files in `/api` folder to serverless functions:
- File: `api/index.js`
- Exposed at: `/api/*`
- Express routes in the file (e.g., `app.get("/profile")`) are accessible at `/api/profile`

---

## Environment Variables Reference

| Variable | Required | Description | Where to Get It |
|----------|----------|-------------|-----------------|
| DATABASE_URL | ✅ Yes | PostgreSQL connection string | Neon Console → Connection Details |

---

## Database Schema

The application uses these PostgreSQL tables:

| Table | Description |
|-------|-------------|
| `user_profiles` | User health profiles (height, weight, age, gender) |
| `health_metrics` | Daily health tracking (steps, heart rate, blood pressure) |
| `exercises` | Exercise recommendations with benefits |
| `foods` | Healthy food suggestions with nutritional info |
| `heart_tips` | Heart health tips and guidance |

---

## Local Development

To run the app locally:

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your database URL
echo "DATABASE_URL=your_neon_connection_string" > .env

# 3. Push database schema
npm run db:push

# 4. (Optional) Seed database with initial data
npx tsx server/seed.ts

# 5. Start development server
npm run dev
```

Visit `http://localhost:5000`

---

## Updating Your Deployment

After making code changes:

```bash
# 1. Commit your changes
git add .
git commit -m "Update: description of changes"

# 2. Push to GitHub
git push origin main

# 3. Vercel will automatically deploy the changes
```

You can monitor deployments at: https://vercel.com/dashboard

---

## Need Help?

- **Vercel Logs**: Check function logs in Vercel Dashboard → Your Project → Logs
- **Database Issues**: Check Neon Console for connection status
- **API Testing**: Use the `/api/health` endpoint to verify API is running

---

**Last Updated**: October 22, 2025  
**Status**: ✅ Deployment Configuration Complete
