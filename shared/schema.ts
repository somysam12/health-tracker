import { z } from "zod";

// User Profile Schema
export const userProfileSchema = z.object({
  height: z.number().positive(), // in cm
  weight: z.number().positive(), // in kg
  age: z.number().int().positive(),
  gender: z.enum(["male", "female", "other"]),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Health Metrics Schema
export const healthMetricsSchema = z.object({
  steps: z.number().int().nonnegative(),
  heartRate: z.number().int().positive(), // beats per minute
  systolicBP: z.number().int().positive().optional(), // blood pressure
  diastolicBP: z.number().int().positive().optional(),
  date: z.string(), // ISO date string
});

export type HealthMetrics = z.infer<typeof healthMetricsSchema>;

// BMI Result Schema
export const bmiResultSchema = z.object({
  bmi: z.number(),
  category: z.enum(["underweight", "normal", "overweight", "obese"]),
  recommendation: z.string(),
});

export type BMIResult = z.infer<typeof bmiResultSchema>;

// Exercise Schema
export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["cardio", "strength", "flexibility", "balance"]),
  description: z.string(),
  benefits: z.array(z.string()),
  duration: z.string(), // e.g., "30 minutes"
  intensity: z.enum(["low", "moderate", "high"]),
  heartHealthRating: z.number().min(1).max(5), // 1-5 stars
  caloriesBurned: z.number().optional(),
});

export type Exercise = z.infer<typeof exerciseSchema>;

// Food Schema
export const foodSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["fruits", "vegetables", "proteins", "grains", "dairy", "nuts"]),
  description: z.string(),
  benefits: z.array(z.string()),
  calories: z.number(),
  nutrients: z.object({
    protein: z.string(),
    fiber: z.string(),
    vitamins: z.array(z.string()),
  }),
  heartHealthy: z.boolean(),
});

export type Food = z.infer<typeof foodSchema>;

// Heart Rate Reference by Age
export const heartRateReferenceSchema = z.object({
  ageGroup: z.string(),
  restingMin: z.number(),
  restingMax: z.number(),
  maxHeartRate: z.number(),
  moderateMin: z.number(),
  moderateMax: z.number(),
});

export type HeartRateReference = z.infer<typeof heartRateReferenceSchema>;

// Walking Recommendation Schema
export const walkingRecommendationSchema = z.object({
  dailySteps: z.number(),
  duration: z.string(),
  intensity: z.string(),
  tips: z.array(z.string()),
});

export type WalkingRecommendation = z.infer<typeof walkingRecommendationSchema>;

// Heart Disease Patient Tips Schema
export const heartPatientTipSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(["walking", "exercise", "diet", "monitoring", "lifestyle"]),
  importance: z.enum(["critical", "important", "helpful"]),
});

export type HeartPatientTip = z.infer<typeof heartPatientTipSchema>;

// Insert schemas for creating new records
export const insertHealthMetricsSchema = healthMetricsSchema.omit({ date: true });
export type InsertHealthMetrics = z.infer<typeof insertHealthMetricsSchema>;
