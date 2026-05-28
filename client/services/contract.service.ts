import { apiFetch } from "./api";

export type ContractSignResponse = {
  embedSrc: string;
  submissionId?: number;
  submitterId?: number;
};

export async function initContractSign() {
  return apiFetch<ContractSignResponse>("/contract-sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
}

export async function completeContractSign() {
  return apiFetch<{ success: boolean }>("/contract-sign/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
}
