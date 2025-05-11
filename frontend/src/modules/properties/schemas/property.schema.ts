import { z } from "zod";
import {
  longText,
  noSpecialChar,
  onlyLetters,
  onlyNumber,
} from "@/utils/validations";
import { TypeOfProperty } from "../enums/TypeOfProperty";

export const PropertySchema = z.object({
  address: z.object({
    country: onlyLetters,
    province: onlyLetters,
    locality: onlyLetters,
    street: noSpecialChar,
    number: noSpecialChar,
    postalCode: noSpecialChar,
  }),
   typeOfProperty: z.nativeEnum(TypeOfProperty),
  observations: longText,
  ownerId:  onlyNumber,
});

export type PropertyFormData = z.infer<typeof PropertySchema>;
