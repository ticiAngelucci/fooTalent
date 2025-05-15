import { dates, floatValues, longText, onlyNumber } from "@/utils/validations";
import { z } from "zod";
import { Currency, PaymentMethod, ServiceType } from "../enums/PaymentEnums";

export const PaymentSchema = z.object({
    contractId: onlyNumber,
    amount: floatValues,
    paymentDate: dates,
    serviceType: z.nativeEnum(ServiceType) ,
    paymentMethod: z.nativeEnum(PaymentMethod),
    currency: z.nativeEnum(Currency) ,
    description: longText
})

export type PaymentFormData = z.infer<typeof PaymentSchema>;