import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Owner } from "../types/owner";
import { Tenant } from "../types/tenant";
import { Property } from "../types/property";

interface Props {
  formData: {
    ownerId: string;
    tenantId: string;
    propertyId: string;
  };
  handleChange: (key: string, value: any) => void;
  owners: Owner[];
  tenants: Tenant[];
  properties: Property[];
}

export const EditableSelectFields = ({
  formData,
  handleChange,
  owners,
  tenants,
  properties,
}: Props) => {
  const [isEditingFields, setIsEditingFields] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        {!isEditingFields && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditingFields(true)}
          >
            Editar campos
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 text-sm font-semibold">Propietario</Label>
          {isEditingFields ? (
            <Select
              value={formData.ownerId}
              onValueChange={(val) => handleChange("ownerId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar propietario" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem
                    key={owner.idOwner}
                    value={owner.idOwner.toString()}
                  >
                    {owner.firstName} {owner.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type="text"
              disabled
              value={
                owners.find((o) => o.idOwner.toString() === formData.ownerId)
                  ? `${owners.find((o) => o.idOwner.toString() === formData.ownerId)?.firstName} ${owners.find((o) => o.idOwner.toString() === formData.ownerId)?.lastName}`
                  : ""
              }
            />
          )}
        </div>

        <div>
          <Label className="mb-2 text-sm font-semibold">Inquilino</Label>
          {isEditingFields ? (
            <Select
              value={formData.tenantId}
              onValueChange={(val) => handleChange("tenantId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar inquilino" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id.toString()}>
                    {tenant.firstName} {tenant.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type="text"
              disabled
              value={
                tenants.find((t) => t.id.toString() === formData.tenantId)
                  ? `${tenants.find((t) => t.id.toString() === formData.tenantId)?.firstName} ${tenants.find((t) => t.id.toString() === formData.tenantId)?.lastName}`
                  : ""
              }
            />
          )}
        </div>
      </div>

      <div className="mt-4">
        <Label className="mb-2 text-sm font-semibold">Inmueble</Label>
        {isEditingFields ? (
          <Select
            value={formData.propertyId}
            onValueChange={(val) => handleChange("propertyId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar inmueble" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((p) => (
                <SelectItem
                  key={p.id_property}
                  value={p.id_property.toString()}
                >
                  {p.street} {p.number}, {p.locality}, {p.province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="text"
            disabled
            value={
              properties.find(
                (p) => p.id_property.toString() === formData.propertyId
              )
                ? `${properties.find(
                    (p) => p.id_property.toString() === formData.propertyId
                  )?.street}, ${
                    properties.find(
                      (p) => p.id_property.toString() === formData.propertyId
                    )?.locality
                  }, ${
                    properties.find(
                      (p) => p.id_property.toString() === formData.propertyId
                    )?.province
                  }`
                : ""
            }
          />
        )}
      </div>
    </>
  );
};
