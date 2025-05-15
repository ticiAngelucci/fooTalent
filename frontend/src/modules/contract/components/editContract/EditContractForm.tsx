import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { Minus, Plus, SaveIcon, Pencil } from "lucide-react";
import { updateContract } from "../../services/updateContractService";
import {
  fetchOwners,
  fetchProperties,
  fetchTenants,
} from "../../services/createContractService";
import { Owner } from "../../types/owner";
import { Tenant } from "../../types/tenant";
import { Property } from "../../types/property";
import DocumentUpload from "../DocumentUpload";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";

const EditContractPage = () => {
  const { state } = useLocation();
  const contract = state.contract;
  const navigate = useNavigate();

  const [owners, setOwners] = useState<Owner[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    ownerId: contract.ownerId?.toString() ?? "",
    tenantId: contract.tenantId?.toString() ?? "",
    propertyId: contract.propertyId?.toString() ?? "",
    startDate: contract.startDate,
    endDate: contract.endDate,
    baseRent: contract.baseRent,
    deadline: contract.deadline,
    deposit: contract.deposit,
    adjustmentFrequency: contract.adjustmentFrequency,
    adjustmentType: contract.adjustmentType,
    adjustmentPercentage: contract.adjustmentPercentage,
  });

  useEffect(() => {
    const loadData = async () => {
      const [ownersData, tenantsData, propertiesData] = await Promise.all([
        fetchOwners(),
        fetchTenants(),
        fetchProperties(),
      ]);

      console.log("Owners", ownersData.content);
      console.log("Tenants", tenantsData.dto);
        console.log("Properties", propertiesData.content);
      
      setOwners(ownersData.content);
      setTenants(tenantsData.dto);
      setProperties(propertiesData.content);
    };
    

    loadData();
  }, []);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formatted = {
      ...formData,
      tenantId: Number(formData.tenantId),
      propertyId: Number(formData.propertyId),
      deposit: Number(formData.deposit),
      baseRent: Number(formData.baseRent),
      deadline: Number(formData.deadline),
    };

    const formDataToSend = new FormData();
    const contractBlob = new Blob([JSON.stringify(formatted)], {
      type: "application/json",
    });

    formDataToSend.append("contract", contractBlob);
    documents.forEach((doc) => {
      formDataToSend.append("documents", doc);
    });

    try {
      await updateContract(contract.id!, formDataToSend);
      SuccessToast({
        title: "Contrato actualizado",
        description: "Los cambios fueron guardados correctamente",
      });
      navigate(-1);
    } catch {
      ErrorToast({
        title: "Error",
        description: "No se pudo actualizar el contrato",
      });
    }
  };

  const getOwnerName = (id: string) => {
    const owner = owners.find((o) => o.idOwner.toString() === id);
    return owner ? `${owner.firstName} ${owner.lastName}` : "";
  };

  const getTenantName = (id: string) => {
    const tenant = tenants.find((t) => t.id.toString() === id);
    return tenant ? `${tenant.firstName} ${tenant.lastName}` : "";
  };

  const getPropertyAddress = (id: string) => {
    const property = properties.find((p) => p.id_property.toString() === id);
    return property ? `${property.street} ${property.number}, ${property.locality}, ${property.province}` : "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-[4fr_3fr] gap-8 p-6 rounded-md shadow-inner bg-white"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-xl">Datos del contrato</h3>
          {!editMode && (
            <Button type="button" variant="ghost" onClick={() => setEditMode(true)}>
              <Pencil size={18} className="mr-2" /> Editar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 text-sm font-semibold">Propietario</Label>
            {editMode ? (
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
              <Input value={getOwnerName(formData.ownerId)} disabled />
            )}
          </div>

          <div>
            <Label className="mb-2 text-sm font-semibold">Inquilino</Label>
            {editMode ? (
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
              <Input value={getTenantName(formData.tenantId)} disabled />
            )}
          </div>
        </div>

        <div>
          <Label className="mb-2 text-sm font-semibold">Inmueble</Label>
          {editMode ? (
            <Select
              value={formData.propertyId}
              onValueChange={(val) => handleChange("propertyId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar inmueble" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id_property} value={p.id_property.toString()}>
                    {p.street} {p.number}, {p.locality}, {p.province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={getPropertyAddress(formData.propertyId)} disabled />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 text-sm font-semibold">
              Fecha de inicio
            </Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2 text-sm font-semibold">
              Fecha de finalización
            </Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 text-sm font-semibold">
            Valor del alquiler
          </Label>
          <Input
            type="number"
            value={formData.baseRent}
            onChange={(e) => handleChange("baseRent", e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-2 text-sm font-semibold">
            Fecha límite de pago
          </Label>
          <div className="flex items-center gap-2 border-2 rounded-sm p-2 border-gray-300 w-[9rem] mt-2">
            <span>{formData.deadline}</span>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                handleChange(
                  "deadline",
                  Math.max(1, Number(formData.deadline) - 1)
                )
              }
            >
              <Minus size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                handleChange("deadline", Number(formData.deadline) + 1)
              }
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 text-sm font-semibold">
              ¿Pagó garantía?
            </Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deposit"
                  value={1}
                  checked={formData.deposit > 0}
                  onChange={() => handleChange("deposit", 1)}
                />
                Pagó
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deposit"
                  value={0}
                  checked={formData.deposit === 0}
                  onChange={() => handleChange("deposit", 0)}
                />
                No pagó
              </label>
            </div>
          </div>

          <div>
            <Label className="mb-2 text-sm font-semibold">
              Valor del depósito
            </Label>
            <Input
              type="number"
              value={formData.deposit}
              onChange={(e) => handleChange("deposit", e.target.value)}
              disabled={formData.deposit === 0}
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 text-sm font-semibold">
            ¿Cada cuánto se ajustará el valor del alquiler?
          </Label>
          <div className="flex gap-4">
            {["TRIMESTRAL", "CUATRIMESTRAL", "SEMESTRAL"].map((freq) => (
              <label key={freq} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="adjustmentFrequency"
                  value={freq}
                  checked={formData.adjustmentFrequency === freq}
                  onChange={() => handleChange("adjustmentFrequency", freq)}
                />
                {freq.charAt(0) + freq.slice(1).toLowerCase()}
              </label>
            ))}
          </div>
        </div>

        <section className="flex justify-between items-center gap-4">
          <div>
            <Label className="mb-2 text-sm font-semibold">
              Método de actualización
            </Label>
            <div className="flex gap-50">
              {["ICL", "FIJO"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="adjustmentType"
                    value={method}
                    checked={formData.adjustmentType === method}
                    onChange={() => handleChange("adjustmentType", method)}
                  />
                  {method === "FIJO" ? "% fijo" : method}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 text-sm font-semibold">% Fijo</Label>
            <Input
              type="number"
              value={formData.adjustmentPercentage}
              onChange={(e) =>
                handleChange("adjustmentPercentage", e.target.value)
              }
              disabled={formData.adjustmentType !== "FIJO"}
              className="w-[22rem]"
              placeholder="%"
            />
          </div>
        </section>

        <div className="flex justify-center items-center mt-6">
          <Button
            type="submit"
            className="w-[45rem] mt-6 bg-brand-800 flex items-center justify-center gap-2 text-white hover:bg-brand-700"
          >
            <SaveIcon />
            Guardar
          </Button>
        </div>
      </div>

      <div className="bg-white px-6 border-l-2 border-neutral-200">
        <h3 className="font-semibold text-xl mb-4">Documentación</h3>
        <DocumentUpload
          documents={documents}
          setDocuments={setDocuments}
          existingDocuments={contract.documents || []}
        />
      </div>
    </form>
  );
};

export default EditContractPage;
