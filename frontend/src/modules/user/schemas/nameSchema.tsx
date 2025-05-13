import {z} from "zod";

export const nameSchema = z.object({
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
})