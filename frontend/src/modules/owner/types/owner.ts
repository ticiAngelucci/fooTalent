export interface Owner {
    id?: number;
    firstName: string;
    lastName: string;
    dni: string;
    phone?: string;
    email?: string;
    street?: string;
    number?: string;
    locality?: string;
    country?: string,
    province?: string;
    postalCode?: string;
    file?: File;
    attachedDocument?: string;
  }