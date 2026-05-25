import { apiFetch } from "./api";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "email" | "system" | "whatsapp";
  read: boolean;
  created_at: string;
}

export async function getNotifications() {
  return apiFetch<Notification[]>("/notifications");
}

export async function markAsRead(id: string) {
  return apiFetch<Notification>(`/notifications/${id}/read`, {
    method: "PUT",
  });
}

export async function markAllAsRead() {
  return apiFetch<{ message: string }>("/notifications/read-all", {
    method: "PUT",
  });
}
