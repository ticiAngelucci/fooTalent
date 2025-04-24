import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .regex(/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/, "El nombre solo puede contener letras y espacios"),
    
    email: z
      .string()
      .email("Correo inválido"),

    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(16, "La contraseña no puede tener más de 16 caracteres")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
      .regex(/[0-9]/, "La contraseña debe contener al menos un número"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
