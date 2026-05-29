import { z } from "zod";

export const registerSchema = z.object({
  firstname: z
    .string()
    .min(1, "El nombre es obligatorio"),
  lastname: z
    .string()
    .min(1, "El apellido es obligatorio"),
  email: z
    .email("Correo electrónico inválido")
    .min(1, "El correo es obligatorio"),
  phone: z
    .string()
    .min(1, "El teléfono es obligatorio"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z
    .string()
    .min(1, "Confirma tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
