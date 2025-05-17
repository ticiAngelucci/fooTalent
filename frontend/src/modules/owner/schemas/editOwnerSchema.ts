import { noSpecialChar, onlyLetters, onlyNumberString, zipCode } from "@/utils/validations";
import { z } from "zod";

export const EditOwnerSchema = z.object({
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
  email: z.string().trim().email("Debes ingresar un correo electrónico válido"),
  phone: onlyNumberString,
  address: z.object({
    country: onlyLetters,
    province: onlyLetters,
    locality: onlyLetters,
    street: noSpecialChar,
    number: onlyNumberString,
    postalCode: zipCode,
  }),
});

export type EditOwnerType = z.infer<typeof EditOwnerSchema>;
