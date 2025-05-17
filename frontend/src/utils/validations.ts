import { z } from "zod";

export const onlyLetters = z
  .string()
  .min(3, { message: "Debe tener al menos 3 caracteres" })
  .max(15, { message: "Debe tener como máximo 15 caracteres" })
  .regex(/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/, { message: "Solo puede contener letras" });

export const noSpecialChar = z
  .string()
  .min(3, { message: "Debe tener al menos 3 caracteres" })
  .max(30, { message: "Debe tener como máximo 30 caracteres" })
  .regex(/^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ]+$/, {
    message: "No puede contener caracteres especiales",
  });

export const zipCode = z
  .string()
  .min(3, { message: "Debe tener al menos 3 caracteres" })
  .max(8, { message: "Debe tener como máximo 8 caracteres" })
  .regex(/^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ]+$/, {
    message: "No puede contener caracteres especiales",
  });

export const shortText = z
  .string()
  .min(3, { message: "Debe tener al menos 3 caracteres" });

export const longText = z
  .string()
  .min(5, { message: "Debe contener al menos 5 caracteres" })
  .max(100, { message: "Te has excedido del máximo de caracteres" });

export const onlyNumber = z
  .number({ message: "Solo se admiten números" })
  .int({ message: "Debe ser un número entero" })
  .nonnegative({ message: "No se admiten valores negativos" });

export const onlyNumberString = z
  .string()
  .regex(/^\d+$/, { message: "Solo se admiten números" });

export const floatValues = z
  .number({ message: "Solo se admiten números" })
  .min(3, { message: "Valor Requerido" })
  .nonnegative({ message: "No se admiten valores negativos" });

export const optionalFloat = z
.number({ message: "Solo se admiten números" })
  .nonnegative({ message: "No se admiten valores negativos" });
export const dates = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)");
