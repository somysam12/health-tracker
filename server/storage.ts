import type {
  UserProfile,
  HealthMetrics,
  Exercise,
  Food,
  HeartPatientTip,
  HeartRateReference,
} from "@shared/schema";

export interface IStorage {
  // Profile
  getProfile(): Promise<UserProfile | undefined>;
  updateProfile(profile: UserProfile): Promise<UserProfile>;

  // Health Metrics
  getTodayMetrics(): Promise<HealthMetrics | undefined>;
  updateSteps(steps: number): Promise<HealthMetrics>;
  updateHeartRate(heartRate: number): Promise<HealthMetrics>;
  updateBloodPressure(systolic: number, diastolic: number): Promise<HealthMetrics>;

  // Exercises
  getAllExercises(): Promise<Exercise[]>;

  // Foods
  getAllFoods(): Promise<Food[]>;

  // Heart Tips
  getAllHeartTips(): Promise<HeartPatientTip[]>;

  // Heart Rate References
  getHeartRateReferences(): Promise<HeartRateReference[]>;
}

export class MemStorage implements IStorage {
  private profile: UserProfile | undefined;
  private todayMetrics: HealthMetrics;
  private exercises: Exercise[];
  private foods: Food[];
  private heartTips: HeartPatientTip[];
  private heartRateReferences: HeartRateReference[];

  constructor() {
    // Initialize with default data
    this.todayMetrics = {
      steps: 0,
      heartRate: 72,
      systolicBP: 120,
      diastolicBP: 80,
      date: new Date().toISOString(),
    };

    // Heart Rate References by age
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

    // Exercise database
    this.exercises = [
      {
        id: "1",
        name: "Brisk Walking",
        category: "cardio",
        description: "A moderate-intensity cardiovascular exercise that's gentle on joints and excellent for heart health.",
        benefits: [
          "Improves cardiovascular endurance",
          "Strengthens heart muscle",
          "Lowers blood pressure",
          "Helps maintain healthy weight",
        ],
        duration: "30-45 minutes",
        intensity: "moderate",
        heartHealthRating: 5,
        caloriesBurned: 150,
      },
      {
        id: "2",
        name: "Swimming",
        category: "cardio",
        description: "Low-impact full-body workout that's easy on joints while providing excellent cardiovascular benefits.",
        benefits: [
          "Builds cardiovascular strength",
          "Works all major muscle groups",
          "Reduces stress on joints",
          "Improves lung capacity",
        ],
        duration: "30 minutes",
        intensity: "moderate",
        heartHealthRating: 5,
        caloriesBurned: 200,
      },
      {
        id: "3",
        name: "Cycling",
        category: "cardio",
        description: "Great aerobic exercise that strengthens the heart and improves circulation.",
        benefits: [
          "Boosts cardiovascular fitness",
          "Low impact on joints",
          "Strengthens leg muscles",
          "Improves coordination",
        ],
        duration: "30-60 minutes",
        intensity: "moderate",
        heartHealthRating: 4,
        caloriesBurned: 250,
      },
      {
        id: "4",
        name: "Yoga",
        category: "flexibility",
        description: "Combines physical postures, breathing exercises, and meditation for overall wellness.",
        benefits: [
          "Reduces stress and anxiety",
          "Improves flexibility",
          "Lowers blood pressure",
          "Enhances balance and stability",
        ],
        duration: "30-60 minutes",
        intensity: "low",
        heartHealthRating: 4,
        caloriesBurned: 120,
      },
      {
        id: "5",
        name: "Light Weight Training",
        category: "strength",
        description: "Builds muscle strength using light weights or resistance bands, beneficial for metabolism.",
        benefits: [
          "Increases muscle strength",
          "Boosts metabolism",
          "Improves bone density",
          "Supports heart health",
        ],
        duration: "20-30 minutes",
        intensity: "moderate",
        heartHealthRating: 3,
        caloriesBurned: 180,
      },
      {
        id: "6",
        name: "Tai Chi",
        category: "balance",
        description: "Gentle martial art focused on slow, flowing movements and deep breathing.",
        benefits: [
          "Improves balance and coordination",
          "Reduces stress",
          "Lowers blood pressure",
          "Enhances mental clarity",
        ],
        duration: "30-45 minutes",
        intensity: "low",
        heartHealthRating: 4,
        caloriesBurned: 100,
      },
      {
        id: "7",
        name: "Dancing",
        category: "cardio",
        description: "Fun, social activity that provides cardiovascular benefits while improving mood.",
        benefits: [
          "Improves heart health",
          "Enhances coordination",
          "Boosts mood and reduces stress",
          "Increases flexibility",
        ],
        duration: "30-45 minutes",
        intensity: "moderate",
        heartHealthRating: 4,
        caloriesBurned: 200,
      },
      {
        id: "8",
        name: "Stretching",
        category: "flexibility",
        description: "Essential for maintaining flexibility and preventing injuries during other exercises.",
        benefits: [
          "Improves flexibility",
          "Reduces muscle tension",
          "Enhances range of motion",
          "Promotes relaxation",
        ],
        duration: "10-15 minutes",
        intensity: "low",
        heartHealthRating: 3,
        caloriesBurned: 40,
      },
      {
        id: "9",
        name: "Elliptical Training",
        category: "cardio",
        description: "Low-impact cardio machine that simulates running without the joint stress.",
        benefits: [
          "Excellent cardiovascular workout",
          "Low impact on joints",
          "Burns calories efficiently",
          "Works both upper and lower body",
        ],
        duration: "30 minutes",
        intensity: "moderate",
        heartHealthRating: 4,
        caloriesBurned: 270,
      },
    ];

    // Healthy foods database
    this.foods = [
      {
        id: "1",
        name: "Salmon",
        category: "proteins",
        description: "Rich in omega-3 fatty acids, excellent for heart health and reducing inflammation.",
        benefits: [
          "Reduces risk of heart disease",
          "Lowers triglycerides",
          "Reduces inflammation",
          "Supports brain health",
        ],
        calories: 206,
        nutrients: {
          protein: "22g",
          fiber: "0g",
          vitamins: ["Vitamin D", "Vitamin B12", "Omega-3"],
        },
        heartHealthy: true,
      },
      {
        id: "2",
        name: "Oatmeal",
        category: "grains",
        description: "Whole grain packed with soluble fiber that helps lower cholesterol levels.",
        benefits: [
          "Lowers LDL cholesterol",
          "Stabilizes blood sugar",
          "Promotes digestive health",
          "Provides sustained energy",
        ],
        calories: 150,
        nutrients: {
          protein: "5g",
          fiber: "4g",
          vitamins: ["B Vitamins", "Iron", "Magnesium"],
        },
        heartHealthy: true,
      },
      {
        id: "3",
        name: "Blueberries",
        category: "fruits",
        description: "Antioxidant powerhouse that supports heart health and cognitive function.",
        benefits: [
          "Rich in antioxidants",
          "Reduces blood pressure",
          "Improves cholesterol levels",
          "Supports brain health",
        ],
        calories: 84,
        nutrients: {
          protein: "1g",
          fiber: "4g",
          vitamins: ["Vitamin C", "Vitamin K", "Manganese"],
        },
        heartHealthy: true,
      },
      {
        id: "4",
        name: "Spinach",
        category: "vegetables",
        description: "Nutrient-dense leafy green loaded with vitamins and minerals for heart health.",
        benefits: [
          "Lowers blood pressure",
          "Rich in nitrates",
          "Supports bone health",
          "Reduces oxidative stress",
        ],
        calories: 23,
        nutrients: {
          protein: "3g",
          fiber: "2g",
          vitamins: ["Vitamin K", "Vitamin A", "Folate", "Iron"],
        },
        heartHealthy: true,
      },
      {
        id: "5",
        name: "Almonds",
        category: "nuts",
        description: "Heart-healthy nuts rich in healthy fats, fiber, and vitamin E.",
        benefits: [
          "Lowers bad cholesterol",
          "Reduces heart disease risk",
          "Provides healthy fats",
          "Helps control blood sugar",
        ],
        calories: 164,
        nutrients: {
          protein: "6g",
          fiber: "3.5g",
          vitamins: ["Vitamin E", "Magnesium", "Calcium"],
        },
        heartHealthy: true,
      },
      {
        id: "6",
        name: "Avocado",
        category: "fruits",
        description: "Creamy fruit packed with heart-healthy monounsaturated fats and potassium.",
        benefits: [
          "Lowers cholesterol levels",
          "Rich in healthy fats",
          "High in potassium",
          "Supports nutrient absorption",
        ],
        calories: 160,
        nutrients: {
          protein: "2g",
          fiber: "7g",
          vitamins: ["Vitamin K", "Folate", "Potassium"],
        },
        heartHealthy: true,
      },
      {
        id: "7",
        name: "Greek Yogurt",
        category: "dairy",
        description: "Protein-rich dairy product that supports heart health and digestive wellness.",
        benefits: [
          "High in protein",
          "Supports gut health",
          "Provides calcium",
          "May lower blood pressure",
        ],
        calories: 100,
        nutrients: {
          protein: "17g",
          fiber: "0g",
          vitamins: ["Calcium", "Vitamin B12", "Probiotics"],
        },
        heartHealthy: true,
      },
      {
        id: "8",
        name: "Sweet Potato",
        category: "vegetables",
        description: "Nutrient-dense root vegetable high in fiber and antioxidants.",
        benefits: [
          "Regulates blood sugar",
          "Rich in fiber",
          "High in antioxidants",
          "Supports immune system",
        ],
        calories: 112,
        nutrients: {
          protein: "2g",
          fiber: "4g",
          vitamins: ["Vitamin A", "Vitamin C", "Potassium"],
        },
        heartHealthy: true,
      },
      {
        id: "9",
        name: "Walnuts",
        category: "nuts",
        description: "Brain-shaped nuts rich in omega-3s and proven to benefit heart health.",
        benefits: [
          "Improves cholesterol levels",
          "Reduces inflammation",
          "Supports brain function",
          "Rich in omega-3 fatty acids",
        ],
        calories: 185,
        nutrients: {
          protein: "4g",
          fiber: "2g",
          vitamins: ["Omega-3", "Vitamin E", "Magnesium"],
        },
        heartHealthy: true,
      },
      {
        id: "10",
        name: "Broccoli",
        category: "vegetables",
        description: "Cruciferous vegetable packed with vitamins, minerals, and fiber.",
        benefits: [
          "Rich in antioxidants",
          "Supports heart health",
          "High in fiber",
          "Anti-inflammatory properties",
        ],
        calories: 55,
        nutrients: {
          protein: "4g",
          fiber: "5g",
          vitamins: ["Vitamin C", "Vitamin K", "Folate"],
        },
        heartHealthy: true,
      },
    ];

    // Heart patient tips
    this.heartTips = [
      {
        id: "1",
        title: "Start Walking Gradually",
        description: "Begin with just 5-10 minutes of slow walking per day. Gradually increase duration by 1-2 minutes each week as your endurance improves. Never push yourself to the point of chest pain or extreme fatigue.",
        category: "walking",
        importance: "critical",
      },
      {
        id: "2",
        title: "Know Your Target Heart Rate",
        description: "Work with your doctor to determine your target heart rate zone during exercise. For most heart patients, this is 50-70% of maximum heart rate. Use a heart rate monitor or check your pulse regularly during walks.",
        category: "monitoring",
        importance: "critical",
      },
      {
        id: "3",
        title: "Recognize Warning Signs",
        description: "Stop exercising immediately if you experience chest pain, severe shortness of breath, dizziness, irregular heartbeat, or pain radiating to your arm or jaw. Call emergency services if symptoms don't improve with rest.",
        category: "monitoring",
        importance: "critical",
      },
      {
        id: "4",
        title: "Avoid Extreme Temperatures",
        description: "Don't exercise in very hot, cold, or humid weather. Extreme temperatures put extra stress on your heart. Consider indoor walking at a mall or gym during harsh weather conditions.",
        category: "walking",
        importance: "important",
      },
      {
        id: "5",
        title: "Wait After Meals",
        description: "Allow 1-2 hours after eating before exercising. Digestion requires increased blood flow, and exercising too soon after meals can strain your heart.",
        category: "exercise",
        importance: "important",
      },
      {
        id: "6",
        title: "Stay Hydrated",
        description: "Drink water before, during, and after exercise. Dehydration can increase heart rate and blood pressure. Carry water with you on walks and take small sips regularly.",
        category: "exercise",
        importance: "important",
      },
      {
        id: "7",
        title: "Follow the DASH Diet",
        description: "The Dietary Approaches to Stop Hypertension (DASH) diet emphasizes fruits, vegetables, whole grains, lean proteins, and low-fat dairy. Limit sodium to less than 2,300mg per day, ideally 1,500mg.",
        category: "diet",
        importance: "critical",
      },
      {
        id: "8",
        title: "Limit Saturated Fats",
        description: "Reduce intake of saturated fats found in red meat, full-fat dairy, and processed foods. Choose lean proteins like fish, chicken, and plant-based options. This helps lower cholesterol and reduces heart disease risk.",
        category: "diet",
        importance: "important",
      },
      {
        id: "9",
        title: "Take Medications as Prescribed",
        description: "Never skip heart medications, even if you feel fine. Set reminders and keep a consistent schedule. Inform your doctor before taking any new medications or supplements, as they may interact with heart drugs.",
        category: "monitoring",
        importance: "critical",
      },
      {
        id: "10",
        title: "Warm Up and Cool Down",
        description: "Always start with 5-10 minutes of slow walking to warm up your muscles and heart. End with a similar cool-down period. This gradual approach prevents sudden stress on your cardiovascular system.",
        category: "exercise",
        importance: "important",
      },
      {
        id: "11",
        title: "Choose Flat Terrain",
        description: "Start with flat, even surfaces for walking. Hills and stairs increase heart workload significantly. Progress to inclines only after building a solid fitness base and with doctor approval.",
        category: "walking",
        importance: "important",
      },
      {
        id: "12",
        title: "Walk with a Companion",
        description: "Exercise with a friend or family member, especially when starting out. They can help monitor your condition and call for help if needed. It also makes exercise more enjoyable and sustainable.",
        category: "walking",
        importance: "helpful",
      },
      {
        id: "13",
        title: "Monitor Your Blood Pressure",
        description: "Check blood pressure regularly at home, especially before and after exercise. Keep a log to share with your doctor. This helps track your progress and adjust medications if needed.",
        category: "monitoring",
        importance: "important",
      },
      {
        id: "14",
        title: "Manage Stress Effectively",
        description: "Practice stress-reduction techniques like deep breathing, meditation, or gentle yoga. Chronic stress elevates blood pressure and heart rate, increasing cardiovascular risk.",
        category: "lifestyle",
        importance: "important",
      },
      {
        id: "15",
        title: "Get Quality Sleep",
        description: "Aim for 7-9 hours of quality sleep per night. Poor sleep is linked to high blood pressure, obesity, and increased heart disease risk. Maintain a consistent sleep schedule.",
        category: "lifestyle",
        importance: "helpful",
      },
      {
        id: "16",
        title: "Quit Smoking Completely",
        description: "If you smoke, quitting is the single most important thing you can do for your heart. Smoking damages blood vessels, raises blood pressure, and reduces oxygen in your blood. Seek support from your doctor.",
        category: "lifestyle",
        importance: "critical",
      },
      {
        id: "17",
        title: "Limit Alcohol Consumption",
        description: "If you drink alcohol, do so in moderation - no more than one drink per day for women and two for men. Excessive alcohol can raise blood pressure and contribute to heart failure.",
        category: "lifestyle",
        importance: "important",
      },
      {
        id: "18",
        title: "Increase Omega-3 Intake",
        description: "Eat fatty fish (salmon, mackerel, sardines) at least twice a week. Omega-3 fatty acids reduce inflammation, lower triglycerides, and may reduce irregular heartbeats. Consider supplements after consulting your doctor.",
        category: "diet",
        importance: "helpful",
      },
    ];
  }

  async getProfile(): Promise<UserProfile | undefined> {
    return this.profile;
  }

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    this.profile = profile;
    return this.profile;
  }

  async getTodayMetrics(): Promise<HealthMetrics | undefined> {
    return this.todayMetrics;
  }

  async updateSteps(steps: number): Promise<HealthMetrics> {
    this.todayMetrics.steps = steps;
    this.todayMetrics.date = new Date().toISOString();
    return this.todayMetrics;
  }

  async updateHeartRate(heartRate: number): Promise<HealthMetrics> {
    this.todayMetrics.heartRate = heartRate;
    this.todayMetrics.date = new Date().toISOString();
    return this.todayMetrics;
  }

  async updateBloodPressure(
    systolic: number,
    diastolic: number,
  ): Promise<HealthMetrics> {
    this.todayMetrics.systolicBP = systolic;
    this.todayMetrics.diastolicBP = diastolic;
    this.todayMetrics.date = new Date().toISOString();
    return this.todayMetrics;
  }

  async getAllExercises(): Promise<Exercise[]> {
    return this.exercises;
  }

  async getAllFoods(): Promise<Food[]> {
    return this.foods;
  }

  async getAllHeartTips(): Promise<HeartPatientTip[]> {
    return this.heartTips;
  }

  async getHeartRateReferences(): Promise<HeartRateReference[]> {
    return this.heartRateReferences;
  }
}

export const storage = new MemStorage();
