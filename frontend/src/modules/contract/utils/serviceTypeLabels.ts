import { ServiceType } from "../enums/PaymentsEnums";


export const serviceTypeLabels: Record<ServiceType, string> = {
  [ServiceType.RENT]: "Alquiler",
  [ServiceType.DEPOSIT]: "Depósito",
  [ServiceType.EXPENSES]: "Expensas",
  [ServiceType.ELECTRICITY]: "Luz",
  [ServiceType.WATER]: "Agua",
  [ServiceType.GAS]: "Gas",
  [ServiceType.MUNICIPALITY]: "Municipalidad",
  [ServiceType.NOT_APPLICABLE]: "No aplica"
};