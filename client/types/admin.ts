import type { AdminContractorStatus, StepName, OnboardingStatus } from "./onboarding.types";

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
  idFile: { name: string; url: string };
  taxFile: { name: string; url: string };
}

export interface ContractData {
  documentId: string;
  signedAt: string;
  signatureImage: string;
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
  status: "pending" | "approved" | "rejected" | "in_progress";
  data?: PersonalInfoData | DocumentData | ContractData | PaymentData | IdentityData;
}

export interface Contractor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  date: string;
  status: AdminContractorStatus;
  onboardingStatus: OnboardingStatus;
  image: string;
  phone: string;
  country: string;
  steps: ContractorStep[];
}
