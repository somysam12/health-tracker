# Health Monitoring App - Design Guidelines

## Design Approach: Utility-Focused Health Dashboard

**Selected Framework:** Material Design with Apple Health influences
**Rationale:** Health apps require trust, clarity, and data-rich interfaces. Material Design provides excellent patterns for cards, metrics, and data visualization while maintaining accessibility.

**Key Design Principles:**
- Medical-grade clarity and precision
- Calming, trustworthy aesthetics
- Instant data comprehension
- Encouraging, positive tone

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 200 85% 45% (Vibrant health blue - trust and vitality)
- Secondary: 145 60% 50% (Fresh green - wellness and growth)
- Accent: 25 95% 55% (Energetic orange - for alerts and activity)
- Background: 210 20% 98% (Soft off-white)
- Surface: 0 0% 100% (Pure white for cards)
- Text Primary: 220 15% 20%
- Text Secondary: 220 10% 45%

**Dark Mode:**
- Primary: 200 70% 60%
- Secondary: 145 50% 55%
- Accent: 25 85% 60%
- Background: 220 15% 8%
- Surface: 220 12% 12%
- Text Primary: 210 15% 95%
- Text Secondary: 210 10% 70%

**Status Colors:**
- Success/Healthy: 145 60% 50%
- Warning/Caution: 40 95% 55%
- Danger/Critical: 0 75% 55%
- Info: 200 85% 55%

### B. Typography

**Font Family:** 
- Primary: 'Inter' or 'Roboto' (highly legible, modern)
- Numeric Data: 'SF Mono' or 'Roboto Mono' (tabular figures for metrics)

**Scale:**
- Hero Numbers (BMI, Steps): 3xl to 5xl, font-bold
- Section Headers: xl to 2xl, font-semibold
- Metric Labels: sm to base, font-medium, text-secondary
- Body Text: base, font-normal
- Small Data: sm, font-normal

### C. Layout System

**Spacing Primitives:** Consistent use of 4, 6, 8, 12, 16, 24 (p-4, p-6, p-8, p-12, p-16, p-24)
- Card padding: p-6
- Section spacing: gap-8
- Grid gaps: gap-4 to gap-6
- Page margins: px-4 md:px-8

**Grid Structure:**
- Mobile: Single column stacked cards
- Tablet: 2-column grid for metrics
- Desktop: 3-4 column dashboard grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

**Container:** max-w-7xl centered with px-4 md:px-8

### D. Component Library

**Dashboard Cards:**
- Rounded corners (rounded-xl)
- Soft shadows (shadow-md with subtle colored tint)
- Glass morphism effect for elevated importance
- Each card has: Icon + Title + Primary Metric + Secondary Info + Action

**Metric Display Patterns:**
- Large circular progress rings for BMI, heart rate
- Horizontal bar charts for blood pressure ranges
- Step counter with animated numbers
- Comparison cards (current vs. target)

**Navigation:**
- Bottom tab bar on mobile (4-5 primary sections)
- Sidebar navigation on desktop
- Icons: Heroicons (outline for inactive, solid for active)

**Forms:**
- Large, touch-friendly inputs (h-12 minimum)
- Clear labels with helper text
- Instant validation feedback
- Steppers for numeric inputs (weight, height)

**Data Visualization:**
- Simple line charts for trends (steps over time)
- Gradient fills under charts
- Reference ranges shown as colored zones
- Clear axis labels and legends

**Buttons:**
- Primary: Solid with primary color, white text
- Secondary: Outline with border-2
- Small action buttons in cards: icon-only, rounded-full
- Floating Action Button for quick entry (bottom-right on mobile)

**Info Cards (Tips & Guides):**
- Left border accent (border-l-4) in status colors
- Icon at top-left
- Title + Description + "Learn More" link
- Background tint matching accent color (very subtle)

**Heart Rate Monitor UI:**
- Real-time animated heart icon (subtle pulse)
- Large BPM display (text-5xl)
- Colored indicator (green/yellow/red based on range)
- Reference chart below showing age-based ranges

**BMI Calculator:**
- Input section: Weight + Height sliders or steppers
- Instant calculation display
- Visual gauge/spectrum showing underweight → obese
- Category badge with appropriate color
- Personalized recommendations below

**Exercise & Food Lists:**
- Card-based list items
- Thumbnail images (rounded-lg)
- Title + Brief description + Benefits tags
- Expandable for full details
- Filter chips at top (All, Cardio, Strength, etc.)

### E. Animations

**Minimal & Purposeful:**
- Number counting animations when metrics update
- Subtle heart pulse animation (1.5s interval)
- Progress ring fills (ease-out, 1s duration)
- Page transitions: Simple fade (200ms)
- NO elaborate scroll animations
- Skeleton loaders for data fetching

---

## Images

**Hero/Dashboard Header:**
- Background: Subtle gradient overlay (primary to secondary, 10% opacity)
- OR: Abstract health-themed pattern (ECG line, molecules)
- Height: 120px to 180px on mobile, 200px on desktop

**Exercise & Food Items:**
- Small thumbnails: 80px × 80px, rounded-lg
- High-quality stock images from Unsplash (search: "fitness exercise", "healthy food")
- Consistent cropping and aspect ratio

**Illustrative Graphics:**
- Heart anatomy diagram for heart rate section
- Body silhouette for BMI visualization
- Use inline SVG for simple icons and diagrams

---

## Screen Layouts

**Dashboard (Home):**
- Quick stats grid: Steps Today, Heart Rate, BMI, BP (2×2 grid on mobile, 4 columns on desktop)
- Today's Goal progress card (prominent, top)
- Recent activity timeline
- Quick action buttons: Log Activity, Measure HR, Check BMI

**Step Tracker Page:**
- Large step counter (center, animated)
- Distance in km and meters (below steps)
- Weekly trend chart
- Daily goal setter

**BMI Calculator:**
- Input form (top)
- Result display with gauge (center)
- Category information cards (bottom)
- Tips specific to user's category

**Heart Rate Monitor:**
- Measurement interface (animated)
- Current BPM display
- History chart
- Age-based reference table
- Heart health tips for patients (special section)

**Health Tips Section:**
- Tabbed interface: Heart Health, Exercise, Nutrition
- Card grid of tips (2 columns on tablet, 3 on desktop)
- Detailed view when tapped

**Blood Pressure Info:**
- Educational card with ranges
- Visual chart (systolic/diastolic)
- Logging interface
- Trends over time

This design creates a professional, medically trustworthy health dashboard that prioritizes data clarity and user empowerment through comprehensive health tracking features.