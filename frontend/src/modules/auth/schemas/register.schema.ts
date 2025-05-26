import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .regex(/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/, {
      message: "El nombre solo puede contener letras y espacios",
    }),

  lastName: z
    .string()
    .min(3, { message: "El apellido debe tener al menos 3 caracteres" })
    .regex(/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/, {
      message: "El apellido solo puede contener letras",
    }),

  email: z
    .string()
    .email("El correo debe tener un formato válido"),

  password: z
  .string()
  .regex(/^\S*$/, {
    message: "• La contraseña no puede contener espacios",
  }),
  confirmPassword: z
  .string()
  .regex(/^\S*$/, {
    message: " Verifica que no haya espacios extra al principio o al final"
  }),
})
.superRefine((data, ctx) => {
  const password = data.password;
  const passwordErrors: string[] = [];

  if (password.length < 8 || password.length > 16) {
    passwordErrors.push("• Longitud: 8 a 16 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    passwordErrors.push("• Al menos 1 letra mayúscula");
  }
  if (!/[a-z]/.test(password)) {
  passwordErrors.push("• Al menos 1 letra minúscula");
}
  if (!/[0-9]/.test(password)) {
    passwordErrors.push("• Al menos 1 número");
  }

  if (passwordErrors.length > 0) {
    ctx.addIssue({
      path: ["password"],
      code: z.ZodIssueCode.custom,
      message: passwordErrors.join("\n"),
    });
  }

  if (data.password.trim() !== data.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      code: z.ZodIssueCode.custom,
      message:
        "• Las contraseñas no coinciden\n• Asegúrate de que ambas contraseñas sean exactamente iguales",
    });
  }
});

export type RegisterFormValues = z.infer<typeof registerSchema>;