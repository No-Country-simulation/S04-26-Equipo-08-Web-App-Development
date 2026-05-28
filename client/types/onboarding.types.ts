export type OnboardingStatus =
  | "INVITED"
  | "IN_PROGRESS"
  | "PENDING_VERIFICATION"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "ACTIVE"
  | "REJECTED";

export type StepName =
  | "personal_info"
  | "document_upload"
  | "contract_sign"
  | "payment_setup"
  | "identity_verification";

export type DocumentType =
  | "passport"
  | "id_card"
  | "tax_form"
  | "address_proof";

export type DocumentStatus =
  | "pending"
  | "approved"
  | "rejected";

export type PaymentMethodType =
  | "bank_transfer"
  | "crypto"
  | "cash";

export type VerificationStatus =
  | "pending"
  | "verified"
  | "failed";

export type NotificationType =
  | "email"
  | "system"
  | "whatsapp";

export interface ContractorProfile {
  id: string;
  user_id: string;
  country: string;
  city: string;
  address: string;
  document_type: string;
  document_number: string;
  birth_date: string;
  onboarding_status: OnboardingStatus;
  created_at: string;
  updated_at: string;
}

export interface OnboardingStep {
  id: string;
  contractor_profile_id: string;
  step_name: StepName;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  contractor_profile_id: string;
  document_type: DocumentType;
  file_url: string;
  status: DocumentStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface Contract {
  id: string;
  contractor_profile_id: string;
  contract_version: string | null;
  contract_url: string | null;
  signed: boolean;
  signed_at: string | null;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  contractor_profile_id: string;
  method_type: PaymentMethodType;
  account_holder: string | null;
  account_number: string | null;
  bank_name: string | null;
  swift_code: string | null;
  wallet_address: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface IdentityVerification {
  id: string;
  contractor_profile_id: string;
  status: VerificationStatus;
  verification_provider: string | null;
  verification_notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface OnboardingEvent {
  id: string;
  contractor_profile_id: string;
  event_type: string;
  description: string;
  performed_by: string | null;
  created_at: string;
}

export interface BackendUser {
  id: string;
  email: string;
  role: string;
  firstname: string;
  lastname: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
