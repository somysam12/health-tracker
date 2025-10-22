import { db } from "./db/index.js";
import { userProfiles, healthMetrics, exercises, foods, heartTips } from "./db/schema.js";
import { eq, desc } from "drizzle-orm";
import type {
  UserProfile,
  HealthMetrics,
  Exercise,
  Food,
  HeartPatientTip,
  HeartRateReference,
} from "../shared/schema.js";

export interface IStorage {
  getProfile(): Promise<UserProfile | undefined>;
  updateProfile(profile: UserProfile): Promise<UserProfile>;
  getTodayMetrics(): Promise<HealthMetrics | undefined>;
  updateSteps(steps: number): Promise<HealthMetrics>;
  updateHeartRate(heartRate: number): Promise<HealthMetrics>;
  updateBloodPressure(systolic: number, diastolic: number): Promise<HealthMetrics>;
  getAllExercises(): Promise<Exercise[]>;
  getAllFoods(): Promise<Food[]>;
  getAllHeartTips(): Promise<HeartPatientTip[]>;
  getHeartRateReferences(): Promise<HeartRateReference[]>;
}

export class DatabaseStorage implements IStorage {
  private heartRateReferences: HeartRateReference[];

  constructor() {
    this.heartRateReferences = [
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
  }

  async getProfile(): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).limit(1);
    if (result.length === 0) return undefined;
    
    const profile = result[0];
    return {
      height: profile.height,
      weight: profile.weight,
      age: profile.age,
      gender: profile.gender as "male" | "female" | "other",
    };
  }

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    const existing = await db.select().from(userProfiles).limit(1);
    
    if (existing.length === 0) {
      await db.insert(userProfiles).values({
        height: profile.height,
        weight: profile.weight,
        age: profile.age,
        gender: profile.gender,
      });
    } else {
      await db
        .update(userProfiles)
        .set({
          height: profile.height,
          weight: profile.weight,
          age: profile.age,
          gender: profile.gender,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.id, existing[0].id));
    }
    
    return profile;
  }

  async getTodayMetrics(): Promise<HealthMetrics | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = await db
      .select()
      .from(healthMetrics)
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
      
      const profile = await db.select().from(userProfiles).limit(1);
      if (profile.length > 0) {
        await db.insert(healthMetrics).values({
          userId: profile[0].id,
          steps: 0,
          heartRate: 72,
          systolicBP: 120,
          diastolicBP: 80,
        });
      }
      
      return defaultMetrics;
    }
    
    const metric = result[0];
    return {
      steps: metric.steps,
      heartRate: metric.heartRate,
      systolicBP: metric.systolicBP || undefined,
      diastolicBP: metric.diastolicBP || undefined,
      date: metric.date.toISOString(),
    };
  }

  async updateSteps(steps: number): Promise<HealthMetrics> {
    const profile = await this.ensureProfile();
    const latestMetric = await db
      .select()
      .from(healthMetrics)
      .orderBy(desc(healthMetrics.date))
      .limit(1);
    
    if (latestMetric.length > 0) {
      await db
        .update(healthMetrics)
        .set({ steps, date: new Date() })
        .where(eq(healthMetrics.id, latestMetric[0].id));
      
      return {
        steps,
        heartRate: latestMetric[0].heartRate,
        systolicBP: latestMetric[0].systolicBP || undefined,
        diastolicBP: latestMetric[0].diastolicBP || undefined,
        date: new Date().toISOString(),
      };
    } else {
      await db.insert(healthMetrics).values({
        userId: profile.id,
        steps,
        heartRate: 72,
        systolicBP: 120,
        diastolicBP: 80,
      });
      
      return {
        steps,
        heartRate: 72,
        systolicBP: 120,
        diastolicBP: 80,
        date: new Date().toISOString(),
      };
    }
  }

  async updateHeartRate(heartRate: number): Promise<HealthMetrics> {
    const profile = await this.ensureProfile();
    const latestMetric = await db
      .select()
      .from(healthMetrics)
      .orderBy(desc(healthMetrics.date))
      .limit(1);
    
    if (latestMetric.length > 0) {
      await db
        .update(healthMetrics)
        .set({ heartRate, date: new Date() })
        .where(eq(healthMetrics.id, latestMetric[0].id));
      
      return {
        steps: latestMetric[0].steps,
        heartRate,
        systolicBP: latestMetric[0].systolicBP || undefined,
        diastolicBP: latestMetric[0].diastolicBP || undefined,
        date: new Date().toISOString(),
      };
    } else {
      await db.insert(healthMetrics).values({
        userId: profile.id,
        steps: 0,
        heartRate,
        systolicBP: 120,
        diastolicBP: 80,
      });
      
      return {
        steps: 0,
        heartRate,
        systolicBP: 120,
        diastolicBP: 80,
        date: new Date().toISOString(),
      };
    }
  }

  async updateBloodPressure(
    systolic: number,
    diastolic: number,
  ): Promise<HealthMetrics> {
    const profile = await this.ensureProfile();
    const latestMetric = await db
      .select()
      .from(healthMetrics)
      .orderBy(desc(healthMetrics.date))
      .limit(1);
    
    if (latestMetric.length > 0) {
      await db
        .update(healthMetrics)
        .set({ systolicBP: systolic, diastolicBP: diastolic, date: new Date() })
        .where(eq(healthMetrics.id, latestMetric[0].id));
      
      return {
        steps: latestMetric[0].steps,
        heartRate: latestMetric[0].heartRate,
        systolicBP: systolic,
        diastolicBP: diastolic,
        date: new Date().toISOString(),
      };
    } else {
      await db.insert(healthMetrics).values({
        userId: profile.id,
        steps: 0,
        heartRate: 72,
        systolicBP: systolic,
        diastolicBP: diastolic,
      });
      
      return {
        steps: 0,
        heartRate: 72,
        systolicBP: systolic,
        diastolicBP: diastolic,
        date: new Date().toISOString(),
      };
    }
  }

  async getAllExercises(): Promise<Exercise[]> {
    const result = await db.select().from(exercises);
    return result.map((e) => ({
      id: e.id.toString(),
      name: e.name,
      category: e.category as "cardio" | "strength" | "flexibility" | "balance",
      description: e.description,
      benefits: JSON.parse(e.benefits),
      duration: e.duration,
      intensity: e.intensity as "low" | "moderate" | "high",
      heartHealthRating: e.heartHealthRating,
      caloriesBurned: e.caloriesBurned || undefined,
    }));
  }

  async getAllFoods(): Promise<Food[]> {
    const result = await db.select().from(foods);
    return result.map((f) => ({
      id: f.id.toString(),
      name: f.name,
      category: f.category as "fruits" | "vegetables" | "proteins" | "grains" | "dairy" | "nuts",
      description: f.description,
      benefits: JSON.parse(f.benefits),
      calories: f.calories,
      nutrients: JSON.parse(f.nutrients),
      heartHealthy: f.heartHealthy === 1,
    }));
  }

  async getAllHeartTips(): Promise<HeartPatientTip[]> {
    const result = await db.select().from(heartTips);
    return result.map((t) => ({
      id: t.id.toString(),
      title: t.title,
      description: t.description,
      category: t.category as "walking" | "exercise" | "diet" | "monitoring" | "lifestyle",
      importance: t.importance as "critical" | "important" | "helpful",
    }));
  }

  async getHeartRateReferences(): Promise<HeartRateReference[]> {
    return this.heartRateReferences;
  }

  private async ensureProfile() {
    const profile = await db.select().from(userProfiles).limit(1);
    if (profile.length === 0) {
      const result = await db
        .insert(userProfiles)
        .values({
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
}

export const dbStorage = new DatabaseStorage();
