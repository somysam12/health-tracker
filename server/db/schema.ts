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
