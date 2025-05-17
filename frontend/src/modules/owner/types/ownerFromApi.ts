export type OwnerFromAPI = {
  idOwner: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  address: {
    country: string;
    province: string;
    locality: string;
    street: string;
    number: string;
    postalCode: string;
  };
  documents: {
    id: string;
    url: string;
    publicId: string;
    originalName: string;
    fileType: string;
    extension: string;
  }[];
};
