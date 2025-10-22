-- Complete Neon Database Setup for Health Monitor App
-- This SQL creates all tables to store user IPs and their health data

-- =====================================================
-- Table: user_profiles
-- Stores user profile data indexed by IP address
-- =====================================================
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

-- Create index on ip_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_ip ON user_profiles(ip_address);

-- =====================================================
-- Table: health_metrics
-- Stores daily health measurements for each user
-- =====================================================
CREATE TABLE IF NOT EXISTS health_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
    steps INTEGER NOT NULL DEFAULT 0,
    heart_rate INTEGER NOT NULL,
    systolic_bp INTEGER,
    diastolic_bp INTEGER,
    date TIMESTAMP DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_date ON health_metrics(date);

-- =====================================================
-- Table: exercises
-- Reference table for exercise recommendations
-- =====================================================
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

-- =====================================================
-- Table: foods
-- Reference table for healthy food recommendations
-- =====================================================
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

-- =====================================================
-- Table: heart_tips
-- Reference table for heart health tips
-- =====================================================
CREATE TABLE IF NOT EXISTS heart_tips (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    importance VARCHAR(20) NOT NULL
);

-- =====================================================
-- Insert Sample Exercise Data
-- =====================================================
INSERT INTO exercises (name, category, description, benefits, duration, intensity, heart_health_rating, calories_burned) VALUES
('Brisk Walking', 'cardio', 'A moderate-intensity cardiovascular exercise that''s gentle on joints and excellent for heart health.', '["Improves cardiovascular endurance","Strengthens heart muscle","Lowers blood pressure","Helps maintain healthy weight"]', '30-45 minutes', 'moderate', 5, 150),
('Swimming', 'cardio', 'Low-impact full-body workout that''s easy on joints while providing excellent cardiovascular benefits.', '["Builds cardiovascular strength","Works all major muscle groups","Reduces stress on joints","Improves lung capacity"]', '30 minutes', 'moderate', 5, 200),
('Cycling', 'cardio', 'Great aerobic exercise that strengthens the heart and improves circulation.', '["Boosts cardiovascular fitness","Low impact on joints","Strengthens leg muscles","Improves coordination"]', '30-60 minutes', 'moderate', 4, 250),
('Yoga', 'flexibility', 'Combines physical postures, breathing exercises, and meditation for overall wellness.', '["Reduces stress and anxiety","Improves flexibility","Lowers blood pressure","Enhances balance and stability"]', '30-60 minutes', 'low', 4, 120),
('Light Weight Training', 'strength', 'Builds muscle strength using light weights or resistance bands, beneficial for metabolism.', '["Increases muscle strength","Boosts metabolism","Improves bone density","Supports heart health"]', '20-30 minutes', 'moderate', 3, 180),
('Tai Chi', 'balance', 'Gentle martial art focused on slow, flowing movements and deep breathing.', '["Improves balance and coordination","Reduces stress","Lowers blood pressure","Enhances mental clarity"]', '30-45 minutes', 'low', 4, 100),
('Dancing', 'cardio', 'Fun, social activity that provides cardiovascular benefits while improving mood.', '["Improves heart health","Enhances coordination","Boosts mood and reduces stress","Increases flexibility"]', '30-45 minutes', 'moderate', 4, 200),
('Stretching', 'flexibility', 'Essential for maintaining flexibility and preventing injuries during other exercises.', '["Improves flexibility","Reduces muscle tension","Enhances range of motion","Promotes relaxation"]', '10-15 minutes', 'low', 3, 40),
('Elliptical Training', 'cardio', 'Low-impact cardio machine that simulates running without the joint stress.', '["Excellent cardiovascular workout","Low impact on joints","Burns calories efficiently","Works both upper and lower body"]', '30 minutes', 'moderate', 4, 270)
ON CONFLICT DO NOTHING;

-- =====================================================
-- Insert Sample Food Data
-- =====================================================
INSERT INTO foods (name, category, description, benefits, calories, nutrients, heart_healthy) VALUES
('Salmon', 'proteins', 'Rich in omega-3 fatty acids, excellent for heart health and reducing inflammation.', '["Reduces risk of heart disease","Lowers triglycerides","Reduces inflammation","Supports brain health"]', 206, '{"protein":"22g","fiber":"0g","vitamins":["Vitamin D","Vitamin B12","Omega-3"]}', 1),
('Oatmeal', 'grains', 'Whole grain packed with soluble fiber that helps lower cholesterol levels.', '["Lowers LDL cholesterol","Stabilizes blood sugar","Promotes digestive health","Provides sustained energy"]', 150, '{"protein":"5g","fiber":"4g","vitamins":["B Vitamins","Iron","Magnesium"]}', 1),
('Blueberries', 'fruits', 'Antioxidant powerhouse that supports heart health and cognitive function.', '["Rich in antioxidants","Reduces blood pressure","Improves cholesterol levels","Supports brain health"]', 84, '{"protein":"1g","fiber":"4g","vitamins":["Vitamin C","Vitamin K","Manganese"]}', 1),
('Spinach', 'vegetables', 'Nutrient-dense leafy green loaded with vitamins and minerals for heart health.', '["Lowers blood pressure","Rich in nitrates","Supports bone health","Reduces oxidative stress"]', 23, '{"protein":"3g","fiber":"2g","vitamins":["Vitamin K","Vitamin A","Folate","Iron"]}', 1),
('Almonds', 'nuts', 'Heart-healthy nuts rich in healthy fats, fiber, and vitamin E.', '["Lowers bad cholesterol","Reduces heart disease risk","Provides healthy fats","Helps control blood sugar"]', 164, '{"protein":"6g","fiber":"3.5g","vitamins":["Vitamin E","Magnesium","Calcium"]}', 1),
('Avocado', 'fruits', 'Creamy fruit packed with heart-healthy monounsaturated fats and potassium.', '["Lowers cholesterol levels","Rich in healthy fats","High in potassium","Supports nutrient absorption"]', 160, '{"protein":"2g","fiber":"7g","vitamins":["Vitamin K","Folate","Potassium"]}', 1),
('Greek Yogurt', 'dairy', 'Protein-rich dairy product that supports heart health and digestive wellness.', '["High in protein","Supports gut health","Provides calcium","May lower blood pressure"]', 100, '{"protein":"17g","fiber":"0g","vitamins":["Calcium","Vitamin B12","Probiotics"]}', 1),
('Sweet Potato', 'vegetables', 'Nutrient-dense root vegetable high in fiber and antioxidants.', '["Regulates blood sugar","Rich in fiber","High in antioxidants","Supports immune system"]', 112, '{"protein":"2g","fiber":"4g","vitamins":["Vitamin A","Vitamin C","Potassium"]}', 1),
('Walnuts', 'nuts', 'Brain-shaped nuts rich in omega-3s and proven to benefit heart health.', '["Improves cholesterol levels","Reduces inflammation","Supports brain function","Rich in omega-3 fatty acids"]', 185, '{"protein":"4g","fiber":"2g","vitamins":["Omega-3","Vitamin E","Magnesium"]}', 1),
('Broccoli', 'vegetables', 'Cruciferous vegetable packed with vitamins, minerals, and fiber.', '["Rich in antioxidants","Supports heart health","High in fiber","Anti-inflammatory properties"]', 55, '{"protein":"4g","fiber":"5g","vitamins":["Vitamin C","Vitamin K","Folate"]}', 1)
ON CONFLICT DO NOTHING;

-- =====================================================
-- Insert Heart Health Tips
-- =====================================================
INSERT INTO heart_tips (title, description, category, importance) VALUES
('Start Walking Gradually', 'Begin with just 5-10 minutes of slow walking per day. Gradually increase duration by 1-2 minutes each week as your endurance improves. Never push yourself to the point of chest pain or extreme fatigue.', 'walking', 'critical'),
('Know Your Target Heart Rate', 'Work with your doctor to determine your target heart rate zone during exercise. For most heart patients, this is 50-70% of maximum heart rate. Use a heart rate monitor or check your pulse regularly during walks.', 'monitoring', 'critical'),
('Recognize Warning Signs', 'Stop exercising immediately if you experience chest pain, severe shortness of breath, dizziness, irregular heartbeat, or pain radiating to your arm or jaw. Call emergency services if symptoms don''t improve with rest.', 'monitoring', 'critical'),
('Avoid Extreme Temperatures', 'Don''t exercise in very hot, cold, or humid weather. Extreme temperatures put extra stress on your heart. Consider indoor walking at a mall or gym during harsh weather conditions.', 'walking', 'important'),
('Wait After Meals', 'Allow 1-2 hours after eating before exercising. Digestion requires increased blood flow, and exercising too soon after meals can strain your heart.', 'exercise', 'important'),
('Stay Hydrated', 'Drink water before, during, and after exercise. Dehydration can increase heart rate and blood pressure. Carry water with you on walks and take small sips regularly.', 'exercise', 'important'),
('Follow the DASH Diet', 'The Dietary Approaches to Stop Hypertension (DASH) diet emphasizes fruits, vegetables, whole grains, lean proteins, and low-fat dairy. Limit sodium to less than 2,300mg per day, ideally 1,500mg.', 'diet', 'critical'),
('Limit Saturated Fats', 'Reduce intake of saturated fats found in red meat, full-fat dairy, and processed foods. Choose lean proteins like fish, chicken, and plant-based options. This helps lower cholesterol and reduces heart disease risk.', 'diet', 'important'),
('Take Medications as Prescribed', 'Never skip heart medications, even if you feel fine. Set reminders and keep a consistent schedule. Inform your doctor before taking any new medications or supplements, as they may interact with heart drugs.', 'monitoring', 'critical'),
('Warm Up and Cool Down', 'Always start with 5-10 minutes of slow walking to warm up your muscles and heart. End with a similar cool-down period. This gradual approach prevents sudden stress on your cardiovascular system.', 'exercise', 'important'),
('Choose Flat Terrain', 'Start with flat, even surfaces for walking. Hills and stairs increase heart workload significantly. Progress to inclines only after building a solid fitness base and with doctor approval.', 'walking', 'important'),
('Walk with a Companion', 'Exercise with a friend or family member, especially when starting out. They can help monitor your condition and call for help if needed. It also makes exercise more enjoyable and sustainable.', 'walking', 'helpful'),
('Monitor Your Blood Pressure', 'Check blood pressure regularly at home, especially before and after exercise. Keep a log to share with your doctor. This helps track your progress and adjust medications if needed.', 'monitoring', 'important'),
('Manage Stress Effectively', 'Practice stress-reduction techniques like deep breathing, meditation, or gentle yoga. Chronic stress elevates blood pressure and heart rate, increasing cardiovascular risk.', 'lifestyle', 'important'),
('Get Quality Sleep', 'Aim for 7-9 hours of quality sleep per night. Poor sleep is linked to high blood pressure, obesity, and increased heart disease risk. Maintain a consistent sleep schedule.', 'lifestyle', 'helpful'),
('Quit Smoking Completely', 'If you smoke, quitting is the single most important thing you can do for your heart. Smoking damages blood vessels, raises blood pressure, and reduces oxygen in your blood. Seek support from your doctor.', 'lifestyle', 'critical'),
('Limit Alcohol Consumption', 'If you drink alcohol, do so in moderation - no more than one drink per day for women and two for men. Excessive alcohol can raise blood pressure and contribute to heart failure.', 'lifestyle', 'important'),
('Increase Omega-3 Intake', 'Eat fatty fish (salmon, mackerel, sardines) at least twice a week. Omega-3 fatty acids reduce inflammation, lower triglycerides, and may reduce irregular heartbeats. Consider supplements after consulting your doctor.', 'diet', 'helpful')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Create function to automatically update updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Verification Queries
-- =====================================================
-- Run these to verify your tables are created correctly:

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check user_profiles structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Check if sample data was inserted
SELECT COUNT(*) as exercise_count FROM exercises;
SELECT COUNT(*) as food_count FROM foods;
SELECT COUNT(*) as tip_count FROM heart_tips;
