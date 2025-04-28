import { z } from "zod";

export const userSchema = z
.object({
    role: z.string(),
    email:
    z.string().email("Correo Invalido"),
})

export type UserFormValues = z.infer<typeof userSchema>;