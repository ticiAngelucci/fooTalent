import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre es requerido").max(35, "El nombre no puede tener más de 35 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(35, "La contraseña no puede tener más de 35 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
