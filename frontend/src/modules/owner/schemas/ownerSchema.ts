import { noSpecialChar, onlyLetters, onlyNumberString, zipCode } from "@/utils/validations";
import { z } from "zod";

export const ownerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(30, "El nombre no puede tener más de 30 caracteres"),
  lastName: z
    .string()
    .trim()
    .min(1, "El apellido es obligatorio")
    .max(30, "El apellido no puede tener más de 30 caracteres"),
  dni: z
    .string()
    .trim()
    .regex(/^\d{8}$/, "El DNI debe tener 8 dígitos, sin puntos ni guiones"),
  phone: onlyNumberString,
  email: z.string().trim().email("Debes ingresar un correo electrónico válido"),
  street: noSpecialChar,
  number: onlyNumberString,
  locality: onlyLetters,
  province: onlyLetters,
  postalCode: zipCode,
  files: z
    .array(z.instanceof(File))
    .max(7, "Solo se permiten hasta 7 archivos")
    .optional(),
});

export type Owner = z.infer<typeof ownerSchema>;
