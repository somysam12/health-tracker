import { db } from "./db";
import { exercises, foods, heartTips } from "./db/schema";

async function seed() {
  console.log("Seeding database...");

  const exercisesData = [
    {
      name: "Brisk Walking",
      category: "cardio",
      description: "A moderate-intensity cardiovascular exercise that's gentle on joints and excellent for heart health.",
      benefits: JSON.stringify([
        "Improves cardiovascular endurance",
        "Strengthens heart muscle",
        "Lowers blood pressure",
        "Helps maintain healthy weight",
      ]),
      duration: "30-45 minutes",
      intensity: "moderate",
      heartHealthRating: 5,
      caloriesBurned: 150,
    },
    {
      name: "Swimming",
      category: "cardio",
      description: "Low-impact full-body workout that's easy on joints while providing excellent cardiovascular benefits.",
      benefits: JSON.stringify([
        "Builds cardiovascular strength",
        "Works all major muscle groups",
        "Reduces stress on joints",
        "Improves lung capacity",
      ]),
      duration: "30 minutes",
      intensity: "moderate",
      heartHealthRating: 5,
      caloriesBurned: 200,
    },
    {
      name: "Cycling",
      category: "cardio",
      description: "Great aerobic exercise that strengthens the heart and improves circulation.",
      benefits: JSON.stringify([
        "Boosts cardiovascular fitness",
        "Low impact on joints",
        "Strengthens leg muscles",
        "Improves coordination",
      ]),
      duration: "30-60 minutes",
      intensity: "moderate",
      heartHealthRating: 4,
      caloriesBurned: 250,
    },
    {
      name: "Yoga",
      category: "flexibility",
      description: "Combines physical postures, breathing exercises, and meditation for overall wellness.",
      benefits: JSON.stringify([
        "Reduces stress and anxiety",
        "Improves flexibility",
        "Lowers blood pressure",
        "Enhances balance and stability",
      ]),
      duration: "30-60 minutes",
      intensity: "low",
      heartHealthRating: 4,
      caloriesBurned: 120,
    },
    {
      name: "Light Weight Training",
      category: "strength",
      description: "Builds muscle strength using light weights or resistance bands, beneficial for metabolism.",
      benefits: JSON.stringify([
        "Increases muscle strength",
        "Boosts metabolism",
        "Improves bone density",
        "Supports heart health",
      ]),
      duration: "20-30 minutes",
      intensity: "moderate",
      heartHealthRating: 3,
      caloriesBurned: 180,
    },
    {
      name: "Tai Chi",
      category: "balance",
      description: "Gentle martial art focused on slow, flowing movements and deep breathing.",
      benefits: JSON.stringify([
        "Improves balance and coordination",
        "Reduces stress",
        "Lowers blood pressure",
        "Enhances mental clarity",
      ]),
      duration: "30-45 minutes",
      intensity: "low",
      heartHealthRating: 4,
      caloriesBurned: 100,
    },
    {
      name: "Dancing",
      category: "cardio",
      description: "Fun, social activity that provides cardiovascular benefits while improving mood.",
      benefits: JSON.stringify([
        "Improves heart health",
        "Enhances coordination",
        "Boosts mood and reduces stress",
        "Increases flexibility",
      ]),
      duration: "30-45 minutes",
      intensity: "moderate",
      heartHealthRating: 4,
      caloriesBurned: 200,
    },
    {
      name: "Stretching",
      category: "flexibility",
      description: "Essential for maintaining flexibility and preventing injuries during other exercises.",
      benefits: JSON.stringify([
        "Improves flexibility",
        "Reduces muscle tension",
        "Enhances range of motion",
        "Promotes relaxation",
      ]),
      duration: "10-15 minutes",
      intensity: "low",
      heartHealthRating: 3,
      caloriesBurned: 40,
    },
    {
      name: "Elliptical Training",
      category: "cardio",
      description: "Low-impact cardio machine that simulates running without the joint stress.",
      benefits: JSON.stringify([
        "Excellent cardiovascular workout",
        "Low impact on joints",
        "Burns calories efficiently",
        "Works both upper and lower body",
      ]),
      duration: "30 minutes",
      intensity: "moderate",
      heartHealthRating: 4,
      caloriesBurned: 270,
    },
  ];

  const foodsData = [
    {
      name: "Salmon",
      category: "proteins",
      description: "Rich in omega-3 fatty acids, excellent for heart health and reducing inflammation.",
      benefits: JSON.stringify([
        "Reduces risk of heart disease",
        "Lowers triglycerides",
        "Reduces inflammation",
        "Supports brain health",
      ]),
      calories: 206,
      nutrients: JSON.stringify({
        protein: "22g",
        fiber: "0g",
        vitamins: ["Vitamin D", "Vitamin B12", "Omega-3"],
      }),
      heartHealthy: 1,
    },
    {
      name: "Oatmeal",
      category: "grains",
      description: "Whole grain packed with soluble fiber that helps lower cholesterol levels.",
      benefits: JSON.stringify([
        "Lowers LDL cholesterol",
        "Stabilizes blood sugar",
        "Promotes digestive health",
        "Provides sustained energy",
      ]),
      calories: 150,
      nutrients: JSON.stringify({
        protein: "5g",
        fiber: "4g",
        vitamins: ["B Vitamins", "Iron", "Magnesium"],
      }),
      heartHealthy: 1,
    },
    {
      name: "Blueberries",
      category: "fruits",
      description: "Antioxidant powerhouse that supports heart health and cognitive function.",
      benefits: JSON.stringify([
        "Rich in antioxidants",
        "Reduces blood pressure",
        "Improves cholesterol levels",
        "Supports brain health",
      ]),
      calories: 84,
      nutrients: JSON.stringify({
        protein: "1g",
        fiber: "4g",
        vitamins: ["Vitamin C", "Vitamin K", "Manganese"],
      }),
      heartHealthy: 1,
    },
    {
      name: "Spinach",
      category: "vegetables",
      description: "Nutrient-dense leafy green loaded with vitamins and minerals for heart health.",
      benefits: JSON.stringify([
        "Lowers blood pressure",
        "Rich in nitrates",
        "Supports bone health",
        "Reduces oxidative stress",
      ]),
      calories: 23,
      nutrients: JSON.stringify({
        protein: "3g",
        fiber: "2g",
        vitamins: ["Vitamin K", "Vitamin A", "Folate", "Iron"],
      }),
      heartHealthy: 1,
    },
    {
      name: "Almonds",
      category: "nuts",
      description: "Heart-healthy nuts rich in healthy fats, fiber, and vitamin E.",
      benefits: JSON.stringify([
        "Lowers bad cholesterol",
        "Reduces heart disease risk",
        "Provides healthy fats",
        "Helps control blood sugar",
      ]),
      calories: 164,
      nutrients: JSON.stringify({
        protein: "6g",
        fiber: "3.5g",
        vitamins: ["Vitamin E", "Magnesium", "Calcium"],
      }),
      heartHealthy: 1,
    },
    {
      name: "Avocado",
      category: "fruits",
      description: "Creamy fruit packed with heart-healthy monounsaturated fats and potassium.",
      benefits: JSON.stringify([
        "Lowers cholesterol levels",
        "Rich in healthy fats",
        "High in potassium",
        "Supports nutrient absorption",
      ]),
      calories: 160,
      nutrients: JSON.stringify({
        protein: "2g",
        fiber: "7g",
        vitamins: ["Vitamin K", "Folate", "Potassium"],
      }),
      heartHealthy: 1,
    },
    {
      name: "Greek Yogurt",
      category: "dairy",
      description: "Protein-rich dairy product that supports heart health and digestive wellness.",
      benefits: JSON.stringify([
        "High in protein",
        "Supports gut health",
        "Provides calcium",
        "May lower blood pressure",
      ]),
      calories: 100,
      nutrients: JSON.stringify({
        protein: "17g",
        fiber: "0g",
        vitamins: ["Calcium", "Vitamin B12", "Probiotics"],
      }),
      heartHealthy: 1,
    },
    {
      name: "Sweet Potato",
      category: "vegetables",
      description: "Nutrient-dense root vegetable high in fiber and antioxidants.",
      benefits: JSON.stringify([
        "Regulates blood sugar",
        "Rich in fiber",
        "High in antioxidants",
        "Supports immune system",
      ]),
      calories: 112,
      nutrients: JSON.stringify({
        protein: "2g",
        fiber: "4g",
        vitamins: ["Vitamin A", "Vitamin C", "Potassium"],
      }),
      heartHealthy: 1,
    },
    {
      name: "Walnuts",
      category: "nuts",
      description: "Brain-shaped nuts rich in omega-3s and proven to benefit heart health.",
      benefits: JSON.stringify([
        "Improves cholesterol levels",
        "Reduces inflammation",
        "Supports brain function",
        "Rich in omega-3 fatty acids",
      ]),
      calories: 185,
      nutrients: JSON.stringify({
        protein: "4g",
        fiber: "2g",
        vitamins: ["Omega-3", "Vitamin E", "Magnesium"],
      }),
      heartHealthy: 1,
    },
    {
      name: "Broccoli",
      category: "vegetables",
      description: "Cruciferous vegetable packed with vitamins, minerals, and fiber.",
      benefits: JSON.stringify([
        "Rich in antioxidants",
        "Supports heart health",
        "High in fiber",
        "Anti-inflammatory properties",
      ]),
      calories: 55,
      nutrients: JSON.stringify({
        protein: "4g",
        fiber: "5g",
        vitamins: ["Vitamin C", "Vitamin K", "Folate"],
      }),
      heartHealthy: 1,
    },
  ];

  const heartTipsData = [
    {
      title: "Start Walking Gradually",
      description: "Begin with just 5-10 minutes of slow walking per day. Gradually increase duration by 1-2 minutes each week as your endurance improves. Never push yourself to the point of chest pain or extreme fatigue.",
      category: "walking",
      importance: "critical",
    },
    {
      title: "Know Your Target Heart Rate",
      description: "Work with your doctor to determine your target heart rate zone during exercise. For most heart patients, this is 50-70% of maximum heart rate. Use a heart rate monitor or check your pulse regularly during walks.",
      category: "monitoring",
      importance: "critical",
    },
    {
      title: "Recognize Warning Signs",
      description: "Stop exercising immediately if you experience chest pain, severe shortness of breath, dizziness, irregular heartbeat, or pain radiating to your arm or jaw. Call emergency services if symptoms don't improve with rest.",
      category: "monitoring",
      importance: "critical",
    },
    {
      title: "Avoid Extreme Temperatures",
      description: "Don't exercise in very hot, cold, or humid weather. Extreme temperatures put extra stress on your heart. Consider indoor walking at a mall or gym during harsh weather conditions.",
      category: "walking",
      importance: "important",
    },
    {
      title: "Wait After Meals",
      description: "Allow 1-2 hours after eating before exercising. Digestion requires increased blood flow, and exercising too soon after meals can strain your heart.",
      category: "exercise",
      importance: "important",
    },
    {
      title: "Stay Hydrated",
      description: "Drink water before, during, and after exercise. Dehydration can increase heart rate and blood pressure. Carry water with you on walks and take small sips regularly.",
      category: "exercise",
      importance: "important",
    },
    {
      title: "Follow the DASH Diet",
      description: "The Dietary Approaches to Stop Hypertension (DASH) diet emphasizes fruits, vegetables, whole grains, lean proteins, and low-fat dairy. Limit sodium to less than 2,300mg per day, ideally 1,500mg.",
      category: "diet",
      importance: "critical",
    },
    {
      title: "Limit Saturated Fats",
      description: "Reduce intake of saturated fats found in red meat, full-fat dairy, and processed foods. Choose lean proteins like fish, chicken, and plant-based options. This helps lower cholesterol and reduces heart disease risk.",
      category: "diet",
      importance: "important",
    },
    {
      title: "Take Medications as Prescribed",
      description: "Never skip heart medications, even if you feel fine. Set reminders and keep a consistent schedule. Inform your doctor before taking any new medications or supplements, as they may interact with heart drugs.",
      category: "monitoring",
      importance: "critical",
    },
    {
      title: "Warm Up and Cool Down",
      description: "Always start with 5-10 minutes of slow walking to warm up your muscles and heart. End with a similar cool-down period. This gradual approach prevents sudden stress on your cardiovascular system.",
      category: "exercise",
      importance: "important",
    },
    {
      title: "Choose Flat Terrain",
      description: "Start with flat, even surfaces for walking. Hills and stairs increase heart workload significantly. Progress to inclines only after building a solid fitness base and with doctor approval.",
      category: "walking",
      importance: "important",
    },
    {
      title: "Walk with a Companion",
      description: "Exercise with a friend or family member, especially when starting out. They can help monitor your condition and call for help if needed. It also makes exercise more enjoyable and sustainable.",
      category: "walking",
      importance: "helpful",
    },
    {
      title: "Monitor Your Blood Pressure",
      description: "Check blood pressure regularly at home, especially before and after exercise. Keep a log to share with your doctor. This helps track your progress and adjust medications if needed.",
      category: "monitoring",
      importance: "important",
    },
    {
      title: "Manage Stress Effectively",
      description: "Practice stress-reduction techniques like deep breathing, meditation, or gentle yoga. Chronic stress elevates blood pressure and heart rate, increasing cardiovascular risk.",
      category: "lifestyle",
      importance: "important",
    },
    {
      title: "Get Quality Sleep",
      description: "Aim for 7-9 hours of quality sleep per night. Poor sleep is linked to high blood pressure, obesity, and increased heart disease risk. Maintain a consistent sleep schedule.",
      category: "lifestyle",
      importance: "helpful",
    },
    {
      title: "Quit Smoking Completely",
      description: "If you smoke, quitting is the single most important thing you can do for your heart. Smoking damages blood vessels, raises blood pressure, and reduces oxygen in your blood. Seek support from your doctor.",
      category: "lifestyle",
      importance: "critical",
    },
    {
      title: "Limit Alcohol Consumption",
      description: "If you drink alcohol, do so in moderation - no more than one drink per day for women and two for men. Excessive alcohol can raise blood pressure and contribute to heart failure.",
      category: "lifestyle",
      importance: "important",
    },
    {
      title: "Increase Omega-3 Intake",
      description: "Eat fatty fish (salmon, mackerel, sardines) at least twice a week. Omega-3 fatty acids reduce inflammation, lower triglycerides, and may reduce irregular heartbeats. Consider supplements after consulting your doctor.",
      category: "diet",
      importance: "helpful",
    },
  ];

  const exerciseCount = await db.select().from(exercises);
  if (exerciseCount.length === 0) {
    console.log("Seeding exercises...");
    await db.insert(exercises).values(exercisesData);
  }

  const foodCount = await db.select().from(foods);
  if (foodCount.length === 0) {
    console.log("Seeding foods...");
    await db.insert(foods).values(foodsData);
  }

  const tipsCount = await db.select().from(heartTips);
  if (tipsCount.length === 0) {
    console.log("Seeding heart tips...");
    await db.insert(heartTips).values(heartTipsData);
  }

  console.log("Database seeding complete!");
}

seed().catch(console.error);
