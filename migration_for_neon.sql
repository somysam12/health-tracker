-- Migration SQL for Neon Database
-- This adds IP/Session-based tracking to enable multi-user support
-- Run this on your Neon database to update the schema

-- IMPORTANT: If you have existing data, you must clean it first
-- because the new unique constraint requires unique identifiers
TRUNCATE TABLE health_metrics CASCADE;
TRUNCATE TABLE user_profiles CASCADE;

-- Add ip_address column to user_profiles table
-- Length is 100 to accommodate session IDs like "session_1234567890_abc123"
ALTER TABLE user_profiles 
ADD COLUMN ip_address VARCHAR(100) NOT NULL;

-- Create unique index on ip_address
CREATE UNIQUE INDEX user_profiles_ip_address_unique ON user_profiles(ip_address);

-- Note: After running this migration:
-- 1. Each user with a unique IP will be identified by "ip_<their_ip>"
-- 2. Users on localhost or behind proxies will get a session ID like "session_<timestamp>_<random>"
-- 3. Each user will have their own separate data (profile and health metrics)
-- 4. Session-based users will maintain their data across browser sessions via cookies
