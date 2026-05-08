DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS magic_links CASCADE;
DROP TABLE IF EXISTS onboarding_events CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS identity_verifications CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS onboarding_steps CASCADE;
DROP TABLE IF EXISTS contractor_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS role CASCADE;
DROP TYPE IF EXISTS onboarding_status CASCADE;
DROP TYPE IF EXISTS step_name CASCADE;
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS document_status CASCADE;
DROP TYPE IF EXISTS payment_method_type CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- ======================================================
-- EXTENSION UUID
-- ======================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ======================================================
-- ENUMS
-- ======================================================

CREATE TYPE role AS ENUM (
  'contractor',
  'operator',
  'admin'
);

CREATE TYPE onboarding_status AS ENUM (
  'INVITED',
  'IN_PROGRESS',
  'PENDING_VERIFICATION',
  'CHANGES_REQUESTED',
  'APPROVED',
  'ACTIVE',
  'REJECTED'
);

CREATE TYPE step_name AS ENUM (
  'personal_info',
  'document_upload',
  'contract_sign',
  'payment_setup',
  'identity_verification'
);

CREATE TYPE document_type AS ENUM (
  'passport',
  'id_card',
  'tax_form',
  'address_proof'
);

CREATE TYPE document_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE payment_method_type AS ENUM (
  'bank_transfer',
  'crypto',
  'cash'
);

CREATE TYPE verification_status AS ENUM (
  'pending',
  'verified',
  'failed'
);

CREATE TYPE notification_type AS ENUM (
  'email',
  'system',
  'whatsapp'
);

-- ======================================================
-- USERS
-- ======================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT,

  role role NOT NULL DEFAULT 'contractor',

  firstname VARCHAR(100),
  lastname VARCHAR(100),
  phone VARCHAR(50),

  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ======================================================
-- CONTRACTOR PROFILES
-- ======================================================

CREATE TABLE IF NOT EXISTS contractor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL UNIQUE,

  country VARCHAR(100),
  city VARCHAR(100),
  address TEXT,

  document_type VARCHAR(50),
  document_number VARCHAR(100),

  birth_date DATE,

  onboarding_status onboarding_status DEFAULT 'INVITED',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_contractor_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- ======================================================
-- ONBOARDING STEPS
-- ======================================================

CREATE TABLE IF NOT EXISTS onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  contractor_profile_id UUID NOT NULL,

  step_name step_name NOT NULL,

  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,

  notes TEXT,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_steps_contractor
    FOREIGN KEY(contractor_profile_id)
    REFERENCES contractor_profiles(id)
    ON DELETE CASCADE
);

-- ======================================================
-- DOCUMENTS
-- ======================================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  contractor_profile_id UUID NOT NULL,

  document_type document_type NOT NULL,

  file_url TEXT NOT NULL,

  status document_status DEFAULT 'pending',

  reviewed_by UUID,

  reviewed_at TIMESTAMP,

  rejection_reason TEXT,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_documents_contractor
    FOREIGN KEY(contractor_profile_id)
    REFERENCES contractor_profiles(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_documents_reviewed_by
    FOREIGN KEY(reviewed_by)
    REFERENCES users(id)
    ON DELETE SET NULL
);

-- ======================================================
-- CONTRACTS
-- ======================================================

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  contractor_profile_id UUID NOT NULL,

  contract_version VARCHAR(50),

  contract_url TEXT,

  signed BOOLEAN DEFAULT FALSE,

  signed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_contracts_contractor
    FOREIGN KEY(contractor_profile_id)
    REFERENCES contractor_profiles(id)
    ON DELETE CASCADE
);

-- ======================================================
-- PAYMENT METHODS
-- ======================================================

CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  contractor_profile_id UUID NOT NULL,

  method_type payment_method_type NOT NULL,

  account_holder VARCHAR(255),
  account_number VARCHAR(255),
  bank_name VARCHAR(255),
  swift_code VARCHAR(100),

  wallet_address TEXT,

  is_verified BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_payment_contractor
    FOREIGN KEY(contractor_profile_id)
    REFERENCES contractor_profiles(id)
    ON DELETE CASCADE
);

-- ======================================================
-- IDENTITY VERIFICATIONS
-- ======================================================

CREATE TABLE IF NOT EXISTS identity_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  contractor_profile_id UUID NOT NULL,

  status verification_status DEFAULT 'pending',

  verification_provider VARCHAR(100),

  verification_notes TEXT,

  verified_by UUID,

  verified_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_identity_contractor
    FOREIGN KEY(contractor_profile_id)
    REFERENCES contractor_profiles(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_identity_verified_by
    FOREIGN KEY(verified_by)
    REFERENCES users(id)
    ON DELETE SET NULL
);

-- ======================================================
-- NOTIFICATIONS
-- ======================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL,

  title VARCHAR(255),

  message TEXT,

  type notification_type,

  read BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_notifications_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- ======================================================
-- ONBOARDING EVENTS
-- ======================================================

CREATE TABLE IF NOT EXISTS onboarding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  contractor_profile_id UUID NOT NULL,

  event_type VARCHAR(255),

  description TEXT,

  performed_by UUID,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_events_contractor
    FOREIGN KEY(contractor_profile_id)
    REFERENCES contractor_profiles(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_events_user
    FOREIGN KEY(performed_by)
    REFERENCES users(id)
    ON DELETE SET NULL
);

-- ======================================================
-- MAGIC LINKS
-- ======================================================

CREATE TABLE IF NOT EXISTS magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL,

  token TEXT UNIQUE NOT NULL,

  expires_at TIMESTAMP NOT NULL,

  used BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_magic_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- ======================================================
-- CHATS
-- ======================================================

CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  contractor_profile_id UUID NOT NULL,

  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_chats_contractor
    FOREIGN KEY(contractor_profile_id)
    REFERENCES contractor_profiles(id)
    ON DELETE CASCADE
);

-- ======================================================
-- CHAT MESSAGES
-- ======================================================

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  chat_id UUID NOT NULL,

  sender_id UUID NOT NULL,

  message TEXT NOT NULL,

  is_read BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_chat_messages_chat
    FOREIGN KEY(chat_id)
    REFERENCES chats(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_chat_messages_sender
    FOREIGN KEY(sender_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);