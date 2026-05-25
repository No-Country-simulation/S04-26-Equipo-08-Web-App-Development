import { apiFetch } from "./api";
import type {
  AdminContractor,
  ContractorProfile,
  Document,
  IdentityVerification,
} from "@/types/onboarding.types";

export async function getContractors() {
  return apiFetch<AdminContractor[]>("/admin/contractors");
}

export async function getContractorDetail(id: string) {
  return apiFetch<ContractorProfile>(`/admin/contractors/${id}`);
}

export async function approveDocument(documentId: string) {
  return apiFetch<Document>(`/admin/documents/${documentId}/approve`, {
    method: "PUT",
  });
}

export async function rejectDocument(documentId: string, reason: string) {
  return apiFetch<Document>(`/admin/documents/${documentId}/reject`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
}

export async function verifyIdentity(id: string) {
  return apiFetch<IdentityVerification>(`/admin/identity/${id}/verify`, {
    method: "PUT",
  });
}

export async function updateOnboardingStatus(
  contractorId: string,
  status: string
) {
  return apiFetch<ContractorProfile>(
    `/admin/contractors/${contractorId}/status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );
}
