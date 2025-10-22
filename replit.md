# AiSmartWatch - Health Monitoring App

## Project Information

**Website Name:** AiSmartWatch  
**Company:** Trio  
**Co-Founder:** Neeraj Kumar Yadav  
**Publisher:** Shashwat

## Overview

A comprehensive health tracking application built with React and Express that enables users to monitor vital health metrics including steps, BMI, heart rate, and blood pressure. The app provides personalized health recommendations, exercise suggestions, nutritional guidance, and heart health tips designed specifically for wellness monitoring.

**Core Features:**
- Real-time health metrics tracking (steps, heart rate, blood pressure)
- BMI calculation with categorization and recommendations
- Curated exercise library with heart health ratings
- Nutritional food database with health benefits
- Heart patient tips and guidance
- Responsive dashboard with data visualization
- **Multi-user support with IP/Session-based tracking (no login required)**

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React 18 with TypeScript using Vite as the build tool

**UI Component Library:** shadcn/ui (Radix UI primitives) with Tailwind CSS
- Material Design influences for health app clarity
- Custom theme system supporting light/dark modes
- Utility-focused design emphasizing medical-grade clarity
- Responsive layouts optimized for mobile and desktop

**Routing:** wouter for lightweight client-side routing

**State Management:**
- TanStack Query (React Query) for server state management
- Local component state for UI interactions
- Custom theme provider for dark/light mode persistence

**Form Handling:**
- React Hook Form with Zod validation via @hookform/resolvers
- Client-side validation matching server-side schema constraints

**Design System:**
- Custom color palette optimized for health metrics (health blue, wellness green, alert orange)
- Typography: Inter/Roboto for text, SF Mono/Roboto Mono for numeric data
- Consistent spacing and elevation patterns for card-based layouts

### Backend Architecture

**Framework:** Express.js with TypeScript running on Node.js

**API Design:** RESTful JSON API with the following endpoints:
- `/api/profile` - User profile management (height, weight, age, gender)
- `/api/health-metrics/*` - Daily health metrics (steps, heart rate, blood pressure)
- `/api/bmi` - BMI calculation and recommendations
- `/api/exercises` - Exercise library with filtering
- `/api/foods` - Nutritional food database
- `/api/heart-tips` - Heart health guidance
- `/api/heart-rate-references` - Reference ranges for heart rates

**Data Layer:**
- Dual storage support: In-memory (`MemStorage`) and PostgreSQL (`DatabaseStorage`)
- Automatic storage selection based on DATABASE_URL environment variable
- Schema validation using Zod with shared type definitions
- Drizzle ORM configured for PostgreSQL database operations
- Database schema defined in `shared/schema.ts` for type safety across client/server
- **Multi-user data isolation using IP address and session tracking**

**Middleware:**
- Express session middleware for user identification
- JSON body parsing with raw body preservation
- Request/response logging for API routes
- CORS handling for development environment

**Multi-User Architecture:**
- **IP-based tracking** for remote users: `ip_<address>` format
- **Session-based tracking** for localhost/proxy users: `session_<timestamp>_<random>` format
- Secure session cookies with 1-year expiry
- Complete data isolation per user/session
- No authentication required - automatic user identification

**Development Setup:**
- Vite middleware integration for HMR in development
- SSR-style HTML serving in production
- Environment-based configuration

### Data Storage Solutions

**Current Implementation:** Dual storage support
- **In-Memory Storage (`MemStorage`)**: Used when DATABASE_URL is not set
  - Profile data per user (IP/session-based Map storage)
  - Daily health metrics per user with date tracking
  - Static reference data (exercises, foods, heart tips, heart rate ranges)
  
- **PostgreSQL Storage (`DatabaseStorage`)**: Used when DATABASE_URL is configured
  - Production-ready persistent storage via Neon Database
  - Connection pooling with `@neondatabase/serverless`
  - Drizzle ORM for type-safe database queries
  - Migration system configured in `drizzle.config.ts`

**Schema Design:**
- **User profiles** with demographic data and unique IP/session identifier (`ip_address` VARCHAR(100))
- **Time-series health metrics** linked to user profiles via foreign key
- **Reference tables** for exercises, foods, and health tips (shared across users)
- **Multi-tenant isolation** via `ip_address` unique constraint on user_profiles
- Normalized structure for efficient relational queries

**Database Migration:**
- Schema location: `shared/schema.ts`
- Migration file for Neon DB: `migration_for_neon.sql`
- Push command: `npm run db:push`
- Migration output: `./migrations` directory

### External Dependencies

**Database:**
- Neon Serverless Postgres (when DATABASE_URL is configured)
- Connection via `@neondatabase/serverless` package
- Drizzle ORM for database operations

**UI Component Primitives:**
- Radix UI suite for accessible, unstyled components
- Comprehensive set including dialogs, dropdowns, tooltips, forms, etc.

**Styling:**
- Tailwind CSS for utility-first styling
- PostCSS for CSS processing
- Custom theme variables for color system and elevation

**Development Tools:**
- Replit-specific plugins for runtime error overlay and cartographer
- TypeScript for full-stack type safety
- ESBuild for server bundling
- Vite for client bundling and dev server

**Utilities:**
- date-fns for date manipulation
- clsx and tailwind-merge for className management
- class-variance-authority for component variants
- nanoid for unique ID generation

**Note:** The application structure supports easy migration from in-memory storage to PostgreSQL by swapping the storage implementation while maintaining the same interface defined in `IStorage`.