import express from "express";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc } from "drizzle-orm";
import { pgTable, serial, varchar, integer, timestamp, real, text } from "drizzle-orm/pg-core";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Define schemas inline to avoid TypeScript imports
const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  ipAddress: varchar("ip_address", { length: 100 }).notNull().unique(),
  height: real("height").notNull(),
  weight: real("weight").notNull(),
  age: integer("age").notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => userProfiles.id),
  steps: integer("steps").notNull().default(0),
  heartRate: integer("heart_rate").notNull(),
  systolicBP: integer("systolic_bp"),
  diastolicBP: integer("diastolic_bp"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description").notNull(),
  benefits: text("benefits").notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  intensity: varchar("intensity", { length: 20 }).notNull(),
  heartHealthRating: integer("heart_health_rating").notNull(),
  caloriesBurned: integer("calories_burned"),
});

const foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description").notNull(),
  benefits: text("benefits").notNull(),
  calories: integer("calories").notNull(),
  nutrients: text("nutrients").notNull(),
  heartHealthy: integer("heart_healthy").notNull(),
});

const heartTips = pgTable("heart_tips", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  importance: varchar("importance", { length: 20 }).notNull(),
});

// Helper function to get client identifier
function getClientIdentifier(req) {
  let ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           req.headers['x-real-ip'] ||
           req.ip ||
           'demo-user';
  
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
    ip = 'demo-user';
  }
  
  return ip.replace(/^::ffff:/, '').trim();
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbUrlExists = !!process.env.DATABASE_URL;
  const dbUrlLength = process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0;
  
  res.json({
    status: "API is running",
    timestamp: new Date().toISOString(),
    database: {
      configured: dbUrlExists,
      urlLength: dbUrlLength,
      message: dbUrlExists 
        ? "DATABASE_URL is set ✅" 
        : "❌ DATABASE_URL is NOT set! Add it in Vercel Settings → Environment Variables"
    }
  });
});

// Initialize database connection only if DATABASE_URL exists
let db = null;
let sql = null;

if (process.env.DATABASE_URL) {
  try {
    sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema: { userProfiles, healthMetrics, exercises, foods, heartTips } });
    console.log('✅ Database connection initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

// Middleware to check database connection
const requireDatabase = (req, res, next) => {
  if (!db) {
    return res.status(503).json({ 
      error: "Database not configured",
      message: "DATABASE_URL environment variable is missing. Please add it in Vercel Settings → Environment Variables",
      instructions: "1. Go to your Vercel project settings\n2. Navigate to Environment Variables\n3. Add DATABASE_URL with your Neon database connection string"
    });
  }
  next();
};

// Helper functions
async function ensureProfile(ipAddress) {
  const profile = await db.select().from(userProfiles).where(eq(userProfiles.ipAddress, ipAddress)).limit(1);
  if (profile.length === 0) {
    const result = await db
      .insert(userProfiles)
      .values({
        ipAddress: ipAddress,
        height: 170,
        weight: 70,
        age: 30,
        gender: "other",
      })
      .returning();
    return result[0];
  }
  return profile[0];
}

// Profile endpoints
app.get("/api/profile", requireDatabase, async (req, res) => {
  try {
    const ipAddress = getClientIdentifier(req);
    const result = await db.select().from(userProfiles).where(eq(userProfiles.ipAddress, ipAddress)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    const profile = result[0];
    res.json({
      height: profile.height,
      weight: profile.weight,
      age: profile.age,
      gender: profile.gender,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

app.post("/api/profile", requireDatabase, async (req, res) => {
  try {
    const ipAddress = getClientIdentifier(req);
    const existing = await db.select().from(userProfiles).where(eq(userProfiles.ipAddress, ipAddress)).limit(1);
    
    const profileData = {
      height: req.body.height ?? 170,
      weight: req.body.weight ?? 70,
      age: req.body.age ?? 30,
      gender: req.body.gender ?? "other",
    };

    if (existing.length === 0) {
      await db.insert(userProfiles).values({
        ipAddress: ipAddress,
        ...profileData
      });
    } else {
      await db
        .update(userProfiles)
        .set({
          ...profileData,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.id, existing[0].id));
    }
    
    res.json(profileData);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(400).json({ 
      message: "Invalid profile data", 
      details: error.message 
    });
  }
});

// BMI calculation endpoint
app.get("/api/bmi", requireDatabase, async (req, res) => {
  try {
    const ipAddress = getClientIdentifier(req);
    const result = await db.select().from(userProfiles).where(eq(userProfiles.ipAddress, ipAddress)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Profile not found. Please enter your height and weight." });
    }

    const profile = result[0];
    const heightInMeters = profile.height / 100;
    const bmi = profile.weight / (heightInMeters * heightInMeters);

    let category;
    let recommendation;

    if (bmi < 18.5) {
      category = "underweight";
      recommendation = "You may be underweight. Consider consulting a healthcare provider or nutritionist to develop a healthy weight gain plan with nutrient-rich foods and appropriate exercise.";
    } else if (bmi < 25) {
      category = "normal";
      recommendation = "You're at a healthy weight! Maintain it through a balanced diet rich in fruits, vegetables, whole grains, and regular physical activity (150 minutes of moderate exercise weekly).";
    } else if (bmi < 30) {
      category = "overweight";
      recommendation = "You're in the overweight range. Focus on portion control, increase physical activity to 200-300 minutes weekly, and choose whole foods over processed options. Small, sustainable changes work best.";
    } else {
      category = "obese";
      recommendation = "Your BMI indicates obesity, which increases health risks. Consult with healthcare professionals for a comprehensive plan including nutrition counseling, structured exercise, and possibly medical support. Aim for gradual, sustainable weight loss of 1-2 pounds per week.";
    }

    res.json({ bmi, category, recommendation });
  } catch (error) {
    console.error("BMI calculation error:", error);
    res.status(500).json({ message: "Failed to calculate BMI", error: error.message });
  }
});

// Health metrics endpoints
app.get("/api/health-metrics/today", requireDatabase, async (req, res) => {
  try {
    const ipAddress = getClientIdentifier(req);
    const profile = await ensureProfile(ipAddress);
    
    const result = await db
      .select()
      .from(healthMetrics)
      .where(eq(healthMetrics.userId, profile.id))
      .orderBy(desc(healthMetrics.date))
      .limit(1);
    
    if (result.length === 0) {
      const defaultMetrics = {
        steps: 0,
        heartRate: 72,
        systolicBP: 120,
        diastolicBP: 80,
        date: new Date().toISOString(),
      };
      
      await db.insert(healthMetrics).values({
        userId: profile.id,
        steps: 0,
        heartRate: 72,
        systolicBP: 120,
        diastolicBP: 80,
      });
      
      return res.json(defaultMetrics);
    }
    
    const metric = result[0];
    res.json({
      steps: metric.steps,
      heartRate: metric.heartRate,
      systolicBP: metric.systolicBP || undefined,
      diastolicBP: metric.diastolicBP || undefined,
      date: metric.date.toISOString(),
    });
  } catch (error) {
    console.error("Health metrics error:", error);
    res.status(500).json({ message: "Failed to fetch health metrics", error: error.message });
  }
});

app.post("/api/health-metrics/steps", requireDatabase, async (req, res) => {
  try {
    const { steps } = req.body;
    if (typeof steps !== "number" || steps < 0) {
      return res.status(400).json({ message: "Invalid steps value" });
    }

    const ipAddress = getClientIdentifier(req);
    const profile = await ensureProfile(ipAddress);
    const latestMetric = await db
      .select()
      .from(healthMetrics)
      .where(eq(healthMetrics.userId, profile.id))
      .orderBy(desc(healthMetrics.date))
      .limit(1);
    
    if (latestMetric.length > 0) {
      await db
        .update(healthMetrics)
        .set({ steps, date: new Date() })
        .where(eq(healthMetrics.id, latestMetric[0].id));
      
      res.json({
        steps,
        heartRate: latestMetric[0].heartRate,
        systolicBP: latestMetric[0].systolicBP || undefined,
        diastolicBP: latestMetric[0].diastolicBP || undefined,
        date: new Date().toISOString(),
      });
    } else {
      await db.insert(healthMetrics).values({
        userId: profile.id,
        steps,
        heartRate: 72,
        systolicBP: 120,
        diastolicBP: 80,
      });
      
      res.json({
        steps,
        heartRate: 72,
        systolicBP: 120,
        diastolicBP: 80,
        date: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Steps update error:", error);
    res.status(500).json({ message: "Failed to update steps", error: error.message });
  }
});

app.post("/api/health-metrics/heart-rate", requireDatabase, async (req, res) => {
  try {
    const { heartRate } = req.body;
    if (typeof heartRate !== "number" || heartRate < 30 || heartRate > 250) {
      return res.status(400).json({ message: "Invalid heart rate value" });
    }

    const ipAddress = getClientIdentifier(req);
    const profile = await ensureProfile(ipAddress);
    const latestMetric = await db
      .select()
      .from(healthMetrics)
      .where(eq(healthMetrics.userId, profile.id))
      .orderBy(desc(healthMetrics.date))
      .limit(1);
    
    if (latestMetric.length > 0) {
      await db
        .update(healthMetrics)
        .set({ heartRate, date: new Date() })
        .where(eq(healthMetrics.id, latestMetric[0].id));
      
      res.json({
        steps: latestMetric[0].steps,
        heartRate,
        systolicBP: latestMetric[0].systolicBP || undefined,
        diastolicBP: latestMetric[0].diastolicBP || undefined,
        date: new Date().toISOString(),
      });
    } else {
      await db.insert(healthMetrics).values({
        userId: profile.id,
        steps: 0,
        heartRate,
        systolicBP: 120,
        diastolicBP: 80,
      });
      
      res.json({
        steps: 0,
        heartRate,
        systolicBP: 120,
        diastolicBP: 80,
        date: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Heart rate update error:", error);
    res.status(500).json({ message: "Failed to update heart rate", error: error.message });
  }
});

app.post("/api/health-metrics/blood-pressure", requireDatabase, async (req, res) => {
  try {
    const { systolic, diastolic } = req.body;
    if (
      typeof systolic !== "number" ||
      typeof diastolic !== "number" ||
      systolic < 70 ||
      systolic > 200 ||
      diastolic < 40 ||
      diastolic > 130 ||
      diastolic >= systolic
    ) {
      return res.status(400).json({ message: "Invalid blood pressure values" });
    }

    const ipAddress = getClientIdentifier(req);
    const profile = await ensureProfile(ipAddress);
    const latestMetric = await db
      .select()
      .from(healthMetrics)
      .where(eq(healthMetrics.userId, profile.id))
      .orderBy(desc(healthMetrics.date))
      .limit(1);
    
    if (latestMetric.length > 0) {
      await db
        .update(healthMetrics)
        .set({ systolicBP: systolic, diastolicBP: diastolic, date: new Date() })
        .where(eq(healthMetrics.id, latestMetric[0].id));
      
      res.json({
        steps: latestMetric[0].steps,
        heartRate: latestMetric[0].heartRate,
        systolicBP: systolic,
        diastolicBP: diastolic,
        date: new Date().toISOString(),
      });
    } else {
      await db.insert(healthMetrics).values({
        userId: profile.id,
        steps: 0,
        heartRate: 72,
        systolicBP: systolic,
        diastolicBP: diastolic,
      });
      
      res.json({
        steps: 0,
        heartRate: 72,
        systolicBP: systolic,
        diastolicBP: diastolic,
        date: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Blood pressure update error:", error);
    res.status(500).json({ message: "Failed to update blood pressure", error: error.message });
  }
});

// Exercises endpoint
app.get("/api/exercises", requireDatabase, async (req, res) => {
  try {
    const result = await db.select().from(exercises);
    const exerciseList = result.map((e) => ({
      id: e.id.toString(),
      name: e.name,
      category: e.category,
      description: e.description,
      benefits: JSON.parse(e.benefits),
      duration: e.duration,
      intensity: e.intensity,
      heartHealthRating: e.heartHealthRating,
      caloriesBurned: e.caloriesBurned || undefined,
    }));
    res.json(exerciseList);
  } catch (error) {
    console.error("Exercises fetch error:", error);
    res.status(500).json({ message: "Failed to fetch exercises", error: error.message });
  }
});

// Foods endpoint
app.get("/api/foods", requireDatabase, async (req, res) => {
  try {
    const result = await db.select().from(foods);
    const foodList = result.map((f) => ({
      id: f.id.toString(),
      name: f.name,
      category: f.category,
      description: f.description,
      benefits: JSON.parse(f.benefits),
      calories: f.calories,
      nutrients: JSON.parse(f.nutrients),
      heartHealthy: f.heartHealthy === 1,
    }));
    res.json(foodList);
  } catch (error) {
    console.error("Foods fetch error:", error);
    res.status(500).json({ message: "Failed to fetch foods", error: error.message });
  }
});

// Heart tips endpoint
app.get("/api/heart-tips", requireDatabase, async (req, res) => {
  try {
    const result = await db.select().from(heartTips);
    const tipsList = result.map((t) => ({
      id: t.id.toString(),
      title: t.title,
      description: t.description,
      category: t.category,
      importance: t.importance,
    }));
    res.json(tipsList);
  } catch (error) {
    console.error("Heart tips fetch error:", error);
    res.status(500).json({ message: "Failed to fetch heart tips", error: error.message });
  }
});

// Heart rate references endpoint
app.get("/api/heart-rate-references", (req, res) => {
  const references = [
    {
      ageGroup: "Newborns (0-1 month)",
      restingMin: 70,
      restingMax: 190,
      maxHeartRate: 220,
      moderateMin: 110,
      moderateMax: 154,
    },
    {
      ageGroup: "Infants (1-11 months)",
      restingMin: 80,
      restingMax: 160,
      maxHeartRate: 220,
      moderateMin: 110,
      moderateMax: 154,
    },
    {
      ageGroup: "Children (1-2 years)",
      restingMin: 80,
      restingMax: 130,
      maxHeartRate: 215,
      moderateMin: 108,
      moderateMax: 151,
    },
    {
      ageGroup: "Children (3-4 years)",
      restingMin: 80,
      restingMax: 120,
      maxHeartRate: 210,
      moderateMin: 105,
      moderateMax: 147,
    },
    {
      ageGroup: "Children (5-6 years)",
      restingMin: 75,
      restingMax: 115,
      maxHeartRate: 205,
      moderateMin: 103,
      moderateMax: 144,
    },
    {
      ageGroup: "Children (7-9 years)",
      restingMin: 70,
      restingMax: 110,
      maxHeartRate: 200,
      moderateMin: 100,
      moderateMax: 140,
    },
    {
      ageGroup: "Children (10-15 years)",
      restingMin: 60,
      restingMax: 100,
      maxHeartRate: 195,
      moderateMin: 98,
      moderateMax: 137,
    },
    {
      ageGroup: "Adults (18-25 years)",
      restingMin: 60,
      restingMax: 100,
      maxHeartRate: 195,
      moderateMin: 98,
      moderateMax: 137,
    },
    {
      ageGroup: "Adults (26-35 years)",
      restingMin: 60,
      restingMax: 100,
      maxHeartRate: 190,
      moderateMin: 95,
      moderateMax: 133,
    },
    {
      ageGroup: "Adults (36-45 years)",
      restingMin: 60,
      restingMax: 100,
      maxHeartRate: 185,
      moderateMin: 93,
      moderateMax: 130,
    },
    {
      ageGroup: "Adults (46-55 years)",
      restingMin: 60,
      restingMax: 100,
      maxHeartRate: 175,
      moderateMin: 88,
      moderateMax: 123,
    },
    {
      ageGroup: "Adults (56-65 years)",
      restingMin: 60,
      restingMax: 100,
      maxHeartRate: 165,
      moderateMin: 83,
      moderateMax: 116,
    },
    {
      ageGroup: "Seniors (65+ years)",
      restingMin: 60,
      restingMax: 100,
      maxHeartRate: 155,
      moderateMin: 78,
      moderateMax: 109,
    },
  ];
  res.json(references);
});

// Walking recommendation endpoint
app.get("/api/walking-recommendation", requireDatabase, async (req, res) => {
  try {
    const ipAddress = getClientIdentifier(req);
    const result = await db.select().from(userProfiles).where(eq(userProfiles.ipAddress, ipAddress)).limit(1);

    let recommendation;

    if (result.length === 0) {
      recommendation = {
        dailySteps: 10000,
        duration: "30-45 minutes",
        intensity: "Moderate pace",
        tips: [
          "Start with 5-10 minutes if you're new to walking",
          "Walk at a pace where you can talk but not sing",
          "Gradually increase your duration each week",
          "Stay hydrated before, during, and after walking",
        ],
      };
    } else {
      const profile = result[0];
      const heightInMeters = profile.height / 100;
      const bmi = profile.weight / (heightInMeters * heightInMeters);

      if (bmi < 18.5) {
        recommendation = {
          dailySteps: 7000,
          duration: "20-30 minutes",
          intensity: "Light to moderate",
          tips: [
            "Focus on building strength alongside walking",
            "Ensure adequate nutrition to support activity",
            "Don't overexert - rest is important for recovery",
            "Consider resistance training 2-3 times per week",
          ],
        };
      } else if (bmi < 25) {
        recommendation = {
          dailySteps: 10000,
          duration: "30-45 minutes",
          intensity: "Moderate pace",
          tips: [
            "Maintain your healthy habits",
            "Vary your routes to keep it interesting",
            "Try interval walking for extra benefits",
            "Include some hills for added challenge",
          ],
        };
      } else if (bmi < 30) {
        recommendation = {
          dailySteps: 12000,
          duration: "45-60 minutes",
          intensity: "Moderate to brisk",
          tips: [
            "Break walks into 2-3 sessions if needed",
            "Focus on consistency over intensity",
            "Combine with dietary changes for best results",
            "Track your progress to stay motivated",
          ],
        };
      } else {
        recommendation = {
          dailySteps: 8000,
          duration: "30-40 minutes",
          intensity: "Start slow, build gradually",
          tips: [
            "Begin with 10-minute walks, 3 times daily",
            "Choose comfortable, supportive shoes",
            "Walk on flat, even surfaces initially",
            "Consult your doctor before starting",
            "Listen to your body and rest when needed",
          ],
        };
      }
    }

    res.json(recommendation);
  } catch (error) {
    console.error("Walking recommendation error:", error);
    res.status(500).json({ message: "Failed to generate walking recommendation", error: error.message });
  }
});

// Export for Vercel serverless
export default app;
