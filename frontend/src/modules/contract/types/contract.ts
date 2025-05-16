export interface Contract {
    id?: number;
    propertyId: number;
    tenantId: number;
    startDate: string;
    endDate: string;
    value?: number; 
    baseRent: number;
    adjustmentFrequency: "TRIMESTRAL" | "CUATRIMESTRAL" | "SEMESTRAL";
    deadline: number;
    deposit: number;
    active?: boolean; 
    adjustmentPercentage: number;
    adjustmentType: "ICL" | "fijo";
    documents?: File[];
  }
  

export const defaultPageSize = 10;