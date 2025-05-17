import { Owner } from "../schemas/ownerSchema";

export const adaptOwnerToPayload = (formData: Owner) => {
  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    dni: formData.dni,
    email: formData.email,
    phone: formData.phone,
    address: {
      country: formData.country,
      province: formData.province,
      locality: formData.locality,
      street: formData.street,
      number: formData.number,
      postalCode: formData.postalCode,
    },
    attachedDocument: formData.attachedDocument ?? [],
  };
};
