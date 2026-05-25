import { apiFetch } from "./api";

export interface InvitationData {
  email: string;
  role: string;
  expiresAt: string;
}

export async function validateInvitation(
  token: string
) {
  return apiFetch<InvitationData>(
    `/invitations/${token}`
  );
}

export async function sendInvitation(data: {
  contact: string;
  method: "email" | "whatsapp";
}) {
  return apiFetch<{ message: string }>("/invitations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
