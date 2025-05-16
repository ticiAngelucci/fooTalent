import { z } from "zod";
import { dates, floatValues, onlyNumber } from "@/utils/validations";
import { AdjustmentFrequency, AdjustmentType } from "../enums/ContractEnums";

export const ContractSchema = z.object({
  tenantId: onlyNumber,
  propertyId: onlyNumber,
  startDate: dates,
  endDate: dates,
  baseRent: floatValues,
  deadline: onlyNumber,
  deposit: floatValues.optional(),
  adjustmentFrequency: z.nativeEnum(AdjustmentFrequency),
  adjustmentType: z.nativeEnum(AdjustmentType),
  adjustmentPercentage: floatValues,
  documents: z.array(z.instanceof(File)).optional(), // agregado
});

export type ContractFormData = z.infer<typeof ContractSchema>;

