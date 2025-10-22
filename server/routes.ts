import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { userProfileSchema, insertHealthMetricsSchema } from "../shared/schema.js";

function getClientIdentifier(req: any): string {
  // Try to get IP from various sources (Vercel, proxies, etc.)
  let ip = req.ip || 
           req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           req.headers['x-real-ip'] ||
           req.socket?.remoteAddress ||
           req.connection?.remoteAddress;
  
  // If still no IP or localhost, use session-based identifier
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
    if (!req.session.userId) {
      req.session.userId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }
    return req.session.userId;
  }
  
  // Clean the IP address (remove IPv6 prefix)
  const cleanIp = ip.replace(/^::ffff:/, '');
  return `ip_${cleanIp}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Profile endpoints
  app.get("/api/profile", async (req, res) => {
    try {
      const ipAddress = getClientIdentifier(req);
      const profile = await storage.getProfile(ipAddress);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const ipAddress = getClientIdentifier(req);
      // Get existing profile or use defaults
      const existingProfile = await storage.getProfile(ipAddress);
      
      // Merge with new data, using defaults for missing fields
      const profileData = {
        height: req.body.height ?? existingProfile?.height ?? 170,
        weight: req.body.weight ?? existingProfile?.weight ?? 70,
        age: req.body.age ?? existingProfile?.age ?? 30,
        gender: req.body.gender ?? existingProfile?.gender ?? "other",
      };

      const validatedData = userProfileSchema.parse(profileData);
      const profile = await storage.updateProfile(ipAddress, validatedData);
      res.json(profile);
    } catch (error: any) {
      console.error("Profile update error:", error);
      res.status(400).json({ 
        message: "Invalid profile data", 
        details: error.message 
      });
    }
  });

  // BMI calculation endpoint
  app.get("/api/bmi", async (req, res) => {
    try {
      const ipAddress = getClientIdentifier(req);
      const profile = await storage.getProfile(ipAddress);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found. Please enter your height and weight." });
      }

      const heightInMeters = profile.height / 100;
      const bmi = profile.weight / (heightInMeters * heightInMeters);

      let category: "underweight" | "normal" | "overweight" | "obese";
      let recommendation: string;

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
      res.status(500).json({ message: "Failed to calculate BMI" });
    }
  });

  // Health metrics endpoints
  app.get("/api/health-metrics/today", async (req, res) => {
    try {
      const ipAddress = getClientIdentifier(req);
      const metrics = await storage.getTodayMetrics(ipAddress);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });

  app.post("/api/health-metrics/steps", async (req, res) => {
    try {
      const ipAddress = getClientIdentifier(req);
      const { steps } = req.body;
      if (typeof steps !== "number" || steps < 0) {
        return res.status(400).json({ message: "Invalid steps value" });
      }
      const metrics = await storage.updateSteps(ipAddress, steps);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to update steps" });
    }
  });

  app.post("/api/health-metrics/heart-rate", async (req, res) => {
    try {
      const ipAddress = getClientIdentifier(req);
      const { heartRate } = req.body;
      if (typeof heartRate !== "number" || heartRate < 30 || heartRate > 250) {
        return res.status(400).json({ message: "Invalid heart rate value" });
      }
      const metrics = await storage.updateHeartRate(ipAddress, heartRate);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to update heart rate" });
    }
  });

  app.post("/api/health-metrics/blood-pressure", async (req, res) => {
    try {
      const ipAddress = getClientIdentifier(req);
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
      const metrics = await storage.updateBloodPressure(ipAddress, systolic, diastolic);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to update blood pressure" });
    }
  });

  // Exercises endpoint
  app.get("/api/exercises", async (req, res) => {
    try {
      const exercises = await storage.getAllExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  // Foods endpoint
  app.get("/api/foods", async (req, res) => {
    try {
      const foods = await storage.getAllFoods();
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch foods" });
    }
  });

  // Heart tips endpoint
  app.get("/api/heart-tips", async (req, res) => {
    try {
      const tips = await storage.getAllHeartTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch heart tips" });
    }
  });

  // Heart rate references endpoint
  app.get("/api/heart-rate-references", async (req, res) => {
    try {
      const references = await storage.getHeartRateReferences();
      res.json(references);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch heart rate references" });
    }
  });

  // Walking recommendation endpoint
  app.get("/api/walking-recommendation", async (req, res) => {
    try {
      const ipAddress = getClientIdentifier(req);
      const profile = await storage.getProfile(ipAddress);
      const metrics = await storage.getTodayMetrics(ipAddress);

      let recommendation;

      if (!profile) {
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
      res.status(500).json({ message: "Failed to generate walking recommendation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
