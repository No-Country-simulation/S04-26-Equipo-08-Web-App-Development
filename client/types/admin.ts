import type { AdminContractorStatus } from "./onboarding.types";

export interface Contractor {
  name: string;
  email: string;
  specialty: string;
  date: string;
  status: AdminContractorStatus;
  image: string;
}