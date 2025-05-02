import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener mínimo 8 caracteres")
      .max(16, "La contraseña debe tener máximo 16 caracteres")
      .regex(/[A-Z]/, "La contraseña debe tener al menos 1 mayúscula")
      .regex(/[0-9]/, "La contraseña debe tener al menos 1 número"),
    confirmPassword: z
      .string()
      .min(8, "La contraseña debe tener mínimo 8 caracteres")
      .max(16, "La contraseña debe tener máximo 16 caracteres")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
