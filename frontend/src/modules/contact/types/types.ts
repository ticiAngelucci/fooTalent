
export interface ContactoInquilino {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  street: string;
  number: string;
  province: string;
  locality: string;
}

export interface Address {
  street: string;
  locality: string;
  province: string;
  number: string;
  postalCode: string;
}

export interface ContactoPropietario {
  idOwner: number;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
  address: Address;
}

export type Contacto = ContactoInquilino | ContactoPropietario;
