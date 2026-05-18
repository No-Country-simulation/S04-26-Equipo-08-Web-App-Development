import { apiFetch } from "./api";
//import { InvitationData } from "@/types/invitation.types";

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