import { apiFetch } from "./api";

export interface InvitationData {
  email: string;
  role: string;
  expiresAt: string;
}

function decodeJwt(token: string): Record<string, unknown> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Token de invitación inválido");
  return JSON.parse(atob(parts[1]));
}

export async function validateInvitation(token: string) {
  try {
    const payload = decodeJwt(token);

    return {
      email: (payload.email as string) ?? "",
      role: "contractor",
      expiresAt: payload.exp
        ? new Date((payload.exp as number) * 1000).toISOString()
        : "",
    };
  } catch {
    return Promise.reject("El enlace de invitación no es válido o ha expirado");
  }
}

export async function sendMagicLink(data: {
  method: "email" | "whatsapp";
  receiver: {
    email?: string;
    number?: string;
    username: string;
  };
  operatorId: string;
  adminId: string;
}) {
  return apiFetch<{ message?: string; operatorMessage?: string; userMessage?: string }>("/magicLink", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
