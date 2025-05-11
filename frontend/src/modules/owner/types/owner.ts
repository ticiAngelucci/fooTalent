export interface Owner {
    firstName: string;
    lastName: string;
    dni: string;
    phone?: string;
    email?: string;
    street?: string;
    number?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    file?: File;
    attachedDocument?: string;
  }