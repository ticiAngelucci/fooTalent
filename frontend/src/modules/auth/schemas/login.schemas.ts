import { z } from "zod";

export const loginSchema = z
.object({
  email:
   z
   .string()
   .email("Correo inválido"),

  password:
   z
   .string()
   .min(8, "La contraseña debe tener al menos 6 caracteres")
   .max(16, "La contraseña no puede tener más de 35 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

