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

// Drizzle ORM Database Schema
import { pgTable, serial, varchar, integer, timestamp, real, text } from "drizzle-orm/pg-core";

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  height: real("height").notNull(),
  weight: real("weight").notNull(),
  age: integer("age").notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => userProfiles.id),
  steps: integer("steps").notNull().default(0),
  heartRate: integer("heart_rate").notNull(),
  systolicBP: integer("systolic_bp"),
  diastolicBP: integer("diastolic_bp"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description").notNull(),
  benefits: text("benefits").notNull(), // Store as JSON string
  duration: varchar("duration", { length: 50 }).notNull(),
  intensity: varchar("intensity", { length: 20 }).notNull(),
  heartHealthRating: integer("heart_health_rating").notNull(),
  caloriesBurned: integer("calories_burned"),
});

export const foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description").notNull(),
  benefits: text("benefits").notNull(), // Store as JSON string
  calories: integer("calories").notNull(),
  nutrients: text("nutrients").notNull(), // Store as JSON string
  heartHealthy: integer("heart_healthy").notNull(), // 0 or 1 for boolean
});

export const heartTips = pgTable("heart_tips", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  importance: varchar("importance", { length: 20 }).notNull(),
});
