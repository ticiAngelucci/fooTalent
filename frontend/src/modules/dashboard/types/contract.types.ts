export interface DocumentContract {
  id: string;
  url: string;
  publicId: string;
  originalName: string;
  fileType: string;
  extension: string;
}

export interface Contract {
  id: number;
  propertyId: number;
  tenantId: number;
  ownerId: number;
  ownerFullName: string;
  propertyAddress: string;
  tenantFullName: string;
  startDate: string;
  endDate: string;
  deposit: number;
  baseRent: number;
  adjustmentFrequency: string;
  deadline: number;
  active: boolean;
  adjustmentPercentage: number;
  adjustmentType: string;
  documents: DocumentContract[];
}