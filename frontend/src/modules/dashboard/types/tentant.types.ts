export interface TenantDocument {
  id: number | null;
  url: string;
  publicId: string;
  originalName: string;
  fileType: string;
  extension: string;
}

export interface Tenant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  warranty: string;
  country: string;
  province: string;
  locality: string | null;
  street: string;
  number: string;
  postalCode: string;
  documents: TenantDocument[];
}
