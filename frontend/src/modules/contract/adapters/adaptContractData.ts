import { AdjustmentType } from "../enums/ContractEnums";
import { ContractFormData } from "../schemas/contract.schema";

export const adaptContractToFormData = (
  contractFromApi: any
): ContractFormData => {
  return {
    tenantId: contractFromApi.tenantId ?? 0, // si no está, poné un valor por defecto o lanzá error
    propertyId: contractFromApi.propertyId ?? 0,
    startDate: contractFromApi.startDate,
    endDate: contractFromApi.endDate,
    baseRent: contractFromApi.baseRent,
    deadline: contractFromApi.deadline,
    deposit: contractFromApi.deposit ?? 0,
    adjustmentFrequency: contractFromApi.adjustmentFrequency,
    adjustmentType:
      contractFromApi.adjustmentType === "% Fijo"
        ? AdjustmentType.FIJO
        : contractFromApi.adjustmentType,
    adjustmentPercentage: contractFromApi.adjustmentPercentage,
    documents: [],
  };
};
