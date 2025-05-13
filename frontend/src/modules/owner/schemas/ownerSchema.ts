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
  phone: z.string().trim().optional(),
  email: z.string().trim().email("Debes ingresar un email válido").optional(),
  street: z.string().trim().optional(),
  number: z.string().trim().optional(),
  locality: z.string().trim().optional(),
  province: z.string().trim().optional(),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "El código postal debe tener exactamente 4 dígitos")
    .optional(),
  files: z
    .array(z.instanceof(File))
    .max(7, "Solo se permiten hasta 7 archivos")
    .optional(),
});

export type Owner = z.infer<typeof ownerSchema>;
