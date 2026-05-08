# Exmple DB

```
// ======================================================
// NORTHPAY - MVP ONBOARDING CONTRACTORS
// VERSION CORREGIDA
// ======================================================

Enum role {
  contractor
  operator
  admin
}

Enum onboarding_status {
  INVITED
  IN_PROGRESS
  PENDING_VERIFICATION
  CHANGES_REQUESTED
  APPROVED
  ACTIVE
  REJECTED
}

Enum step_name {
  personal_info
  document_upload
  contract_sign
  payment_setup
  identity_verification
}

Enum document_type {
  passport
  id_card
  tax_form
  address_proof
}

Enum document_status {
  pending
  approved
  rejected
}

Enum payment_method_type {
  bank_transfer
  crypto
  effective
}

Enum verification_status {
  pending
  verified
  failed
}

Enum notification_type {
  email
  system
  whatsapp
}

// ======================================================
// USERS
// ======================================================

Table users {
  id uuid [pk]
  email varchar [unique, not null]
  password varchar
  role role [not null]
  firstname varchar
  lastname varchar
  phone varchar
  is_active boolean [default: true]
  created_at timestamp
  updated_at timestamp
}

// ======================================================
// CONTRACTOR PROFILE
// ======================================================

Table contractor_profiles {
  id uuid [pk]
  user_id uuid [not null]
  country varchar
  city varchar
  address text
  document_type varchar
  document_number varchar
  birth_date date
  onboarding_status onboarding_status [default: 'INVITED']
  created_at timestamp
  updated_at timestamp
}

// ======================================================
// ONBOARDING STEPS
// ======================================================

Table onboarding_steps {
  id uuid [pk]
  contractor_profile_id uuid [not null]
  step_name step_name [not null]
  completed boolean [default: false]
  completed_at timestamp
  notes text
  created_at timestamp
}

// ======================================================
// DOCUMENTS
// ======================================================

Table documents {
  id uuid [pk]
  contractor_profile_id uuid [not null]
  document_type document_type [not null]
  file_url text [not null]
  status document_status [default: 'pending']
  reviewed_by uuid
  reviewed_at timestamp
  rejection_reason text
  created_at timestamp
}

// ======================================================
// CONTRACTS
// ======================================================

Table contracts {
  id uuid [pk]
  contractor_profile_id uuid [not null]
  contract_version varchar
  contract_url text
  signed boolean [default: false]
  signed_at timestamp
  created_at timestamp
}

// ======================================================
// PAYMENT METHODS
// ======================================================

Table payment_methods {
  id uuid [pk]
  contractor_profile_id uuid [not null]
  method_type payment_method_type [not null]
  account_holder varchar
  account_number varchar
  bank_name varchar
  swift_code varchar
  wallet_address text
  is_verified boolean [default: false]
  created_at timestamp
}

// ======================================================
// IDENTITY VERIFICATIONS
// ======================================================

Table identity_verifications {
  id uuid [pk]
  contractor_profile_id uuid [not null]
  status verification_status [default: 'pending']
  verification_provider varchar
  verification_notes text
  verified_by uuid
  verified_at timestamp
  created_at timestamp
}

// ======================================================
// NOTIFICATIONS
// ======================================================

Table notifications {
  id uuid [pk]
  user_id uuid [not null]
  title varchar
  message text
  type notification_type
  read boolean [default: false]
  created_at timestamp
}

// ======================================================
// ONBOARDING EVENTS
// ======================================================

Table onboarding_events {
  id uuid [pk]
  contractor_profile_id uuid [not null]
  event_type varchar
  description text
  performed_by uuid
  created_at timestamp
}

// ======================================================
// MAGIC LINKS
// ======================================================

Table magic_links {
  id uuid [pk]
  user_id uuid [not null]
  token text [unique, not null]
  expires_at timestamp
  used boolean [default: false]
  created_at timestamp
}

// ======================================================
// CHATS
// ======================================================

Table chats {
  id uuid [pk]
  contractor_profile_id uuid [not null]
  is_active boolean [default: true]
  created_at timestamp
}

// ======================================================
// CHAT MESSAGES
// ======================================================

Table chat_messages {
  id uuid [pk]
  chat_id uuid [not null]
  sender_id uuid [not null]
  message text
  is_read boolean [default: false]
  created_at timestamp
}

// ======================================================
// RELATIONS
// ======================================================

Ref: contractor_profiles.user_id > users.id

Ref: onboarding_steps.contractor_profile_id > contractor_profiles.id

Ref: documents.contractor_profile_id > contractor_profiles.id
Ref: documents.reviewed_by > users.id

Ref: contracts.contractor_profile_id > contractor_profiles.id

Ref: payment_methods.contractor_profile_id > contractor_profiles.id

Ref: identity_verifications.contractor_profile_id > contractor_profiles.id
Ref: identity_verifications.verified_by > users.id

Ref: notifications.user_id > users.id

Ref: onboarding_events.contractor_profile_id > contractor_profiles.id
Ref: onboarding_events.performed_by > users.id

Ref: magic_links.user_id > users.id

Ref: chats.contractor_profile_id > contractor_profiles.id

Ref: chat_messages.chat_id > chats.id
Ref: chat_messages.sender_id > users.id

```
