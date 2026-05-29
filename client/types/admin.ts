import type { StepName, ContractorProfile, Document, Contract, PaymentMethod, IdentityVerification, OnboardingEvent, BackendUser } from "./onboarding.types";

export interface PersonalInfoData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birthDate: string;
  country: string;
  city: string;
  address: string;
  documentType: string;
  documentNumber: string;
}

export interface DocumentData {
  files: { name: string; url: string; type: string; status: string }[];
}

export interface ContractData {
  documentId: string;
  signedAt: string | null;
  signed: boolean;
  contractUrl: string | null;
}

export interface PaymentData {
  methodType: string;
  accountHolder: string;
  accountNumber: string;
  bankName: string;
}

export interface IdentityData {
  status: string;
  verifiedAt: string | null;
  notes: string;
}

export interface ContractorStep {
  step: StepName;
  label: string;
  status: "pending" | "completed" | "approved" | "rejected" | "in_progress";
  data?: PersonalInfoData | DocumentData | ContractData | PaymentData | IdentityData;
}

export interface Contractor {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  created_at: string;
  is_active: boolean;
  steps: ContractorStep[];
}

export interface ContractorDetail {
  exists: boolean;
  user: BackendUser;
  profile: ContractorProfile | null;
  steps: { step_name: string; completed: boolean; completed_at: string | null; notes: string | null }[];
  documents: Document[];
  contracts: Contract[];
  paymentMethods: PaymentMethod[];
  identityVerifications: IdentityVerification[];
  onboardingEvents: OnboardingEvent[];
}
