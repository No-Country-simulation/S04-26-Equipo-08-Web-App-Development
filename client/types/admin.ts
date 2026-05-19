// src/types/admin.ts

export interface Contractor {
  name: string;
  email: string;
  specialty: string;
  date: string;
  status: "Verified" | "Pending Review" | "Under Review";
  image: string;
}