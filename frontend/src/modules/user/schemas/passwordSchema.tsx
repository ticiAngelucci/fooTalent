import {z} from "zod";

export const passwordSchema = z.object({
    newPassword: z
      .string(),
      oldPassword: z
      .string(),
    confirmPassword: z
      .string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden. Intenta de nuevo: Asegúrate de que ambas contraseñas sean exactamente iguales. Verifica que no haya espacios extra al principio o al final. ",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword != data.oldPassword,{
    message: "La contraseña debe ser diferente a la actual",
    path: ["newPassword"],
  })
  .refine((data) => data.oldPassword != data.newPassword,{
    message: "La contraseña debe ser diferente a la actual",
    path: ["newPassword"],
  })
  .superRefine((data, ctx) => {
    const password = data.newPassword;
    const passwordErrors: string[] = [];
    if( (password.length < 8 || password.length > 16) ||  (!/[A-Z]/.test(password)) || (!/[0-9]/.test(password)) || (passwordErrors.length > 0) ){
            passwordErrors.push("Crea una contraseña segura:");
    }
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
        path: ["newPassword"],
        code: z.ZodIssueCode.custom,
        message: passwordErrors.join("\n"),
      });
    }
  });

export type passwordFormValue = z.infer<typeof passwordSchema>;
