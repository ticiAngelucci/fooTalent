import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ContractFormData, ContractSchema } from '../../schemas/contract.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchOwners, fetchProperties, fetchTenants } from '../../services/createContractService'
import { Owner } from '../../types/owner'
import { Tenant } from '../../types/tenant'
import { Property } from '../../types/property'
import { useUserStore } from '@/store/userStore'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Button } from '@/shared/components/ui/button'
import { CalendarIcon, Minus, PencilLine, Plus, SaveIcon, X } from 'lucide-react'
import { Calendar } from '@/shared/components/ui/calendar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { parse } from "date-fns";
import { Input } from '@/shared/components/ui/input'
import { RadioGroup } from '@radix-ui/react-radio-group'
import { RadioGroupItem } from '@/shared/components/ui/radio-group'
import { AdjustmentFrequency, AdjustmentType } from '../../enums/ContractEnums'
import SuccessToast from '@/shared/components/Toasts/SuccessToast'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Route } from '@/shared/constants/route'
import ErrorToast from '@/shared/components/Toasts/ErrorToast'
import { adaptContractToFormData } from '../../adapters/adaptContractData'
import { updateContract } from '../../services/updateContractService'


interface EditFormProps {
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
  documents: File;
}
type CreateContractFormProps = {
  contract: EditFormProps;
  handleDelete: (id: number) => void;
};

const CreateContractForm = ({ contract, handleDelete }: CreateContractFormProps) => {
  if (!contract) return null

  console.log("contrato a editar",contract);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [ownerId, setOwnerId] = useState<string>();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isDisabled, setDisabled] = useState(true);

  const token = useUserStore.getState().token;
  const navigate = useNavigate();

  const form = useForm<ContractFormData>({
    resolver: zodResolver(ContractSchema),
    defaultValues: { ...adaptContractToFormData(contract) }
  });

  const handleDisable = () => {
    const nextState = !isDisabled;
    setDisabled(nextState);

    if (nextState) {
      form.reset(); 
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const [ownersData, tenantsData] = await Promise.all([
        fetchOwners(),
        fetchTenants(),
      ]);
      setOwnerId(contract.ownerId.toString());
      setOwners(ownersData.content);
      setTenants(tenantsData.dto);
    };
    loadData();
  }, [token]);

  useEffect(() => {
    const getOwnerProperties = async () => {
      if (ownerId) {
        const propertyList = await fetchProperties(ownerId);
        if (propertyList?.length > 0) {
          setProperties(propertyList);
        }
      }
    };
    getOwnerProperties();
  }, [ownerId]);

  const adjustmentType = form.watch("adjustmentType");

  useEffect(() => {
    if (adjustmentType !== AdjustmentType.FIJO) {
      form.setValue("adjustmentPercentage", 0);
    }
  }, [adjustmentType, form]);


  const handleSubmit = async (data: ContractFormData) => {
    try {
      const formDataToSend = new FormData();
      const contractBlob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      formDataToSend.append("contract", contractBlob);

      await updateContract(contract.id, formDataToSend);

      toast.custom(() => (
        <SuccessToast
          title="¡Contrato Editado!"
          description="El contrato se editó correctamente."
        />
      ));

      navigate(Route.Contracts);

    } catch (error: any) {
      let errorMessage = "Ocurrió un problema. Verificá los campos e intentá de nuevo.";

      if (error?.errorCode === "PROPERTY_UNAVAILABLE") {
        errorMessage = error.details?.[0] || error.errorMessage;
      }

      toast.custom(() => (
        <ErrorToast
          title="¡Error al crear el contrato!"
          description={errorMessage}
        />
      ));
    }
  };


  return (
    <>
      <Form {...form}>
        <form
          className="grid grid-cols-[4fr_3fr] gap-8 p-6 rounded-md shadow-inner bg-white"
          onSubmit={form.handleSubmit(handleSubmit, (errors) => console.error("Errores de validación", errors))}>
          <div className="space-y-6">
            <h3 className="font-semibold text-xl">Datos del contrato</h3>
            <div className="grid grid-cols-2 gap-4">

              <FormItem>
                <FormLabel className="mb-2 text-sm font-semibold">
                  Propietario
                  <span className="text-neutral-600 font-normal">(requerido)</span>
                </FormLabel>
                <FormControl>
                  <Select
                    value={ownerId || contract?.ownerId?.toString() || ""}
                    onValueChange={(val) => setOwnerId(val)}
                    disabled={isDisabled ? true : false}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar propietario" />
                    </SelectTrigger>
                    <SelectContent>
                      {owners.map((owner) => (
                        <SelectItem
                          key={owner.idOwner}
                          value={owner.idOwner.toString()} // 👈 el value siempre debe ser string
                        >
                          {owner.firstName} {owner.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormField
                name="tenantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 text-sm font-semibold">
                      Inquilino
                      <span className="text-neutral-600 font-normal">(requerido)</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                        disabled={isDisabled ? true : false}>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>
            <FormField
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 text-sm font-semibold">
                    Inmueble
                    <span className="text-neutral-600 font-normal">(requerido)</span>
                  </FormLabel>
                  <Select value={field.value || ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                    disabled={isDisabled ? true : false}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar inmueble"
                      >
                        {
                          properties.find(p => p.id_property === field.value)?.street +
                          " " + properties.find(p => p.id_property === field.value)?.number +
                          ", " + properties.find(p => p.id_property === field.value)?.locality +
                          ", " + properties.find(p => p.id_property === field.value)?.province
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {properties.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          No hay propiedades disponibles
                        </div>
                      ) : (
                        properties.map((p) => (
                          <SelectItem
                            key={p.id_property}
                            value={p.id_property.toString()}
                          >
                            {p.street} {p.number}, {p.locality}, {p.province}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 text-sm font-semibold">
                      Fecha de inicio
                      <span className="text-neutral-600 font-normal">(requerido)</span>
                    </FormLabel>
                    <Popover modal>
                      <PopoverTrigger
                        className="flex gap-1 items-center py-2 px-3 w-full form-input-custom justify-start !font-normal disabled:bg-neutral-50"
                        disabled={isDisabled ? true : false}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? field.value : <span>Selecciona una fecha</span>}
                      </PopoverTrigger>
                      <PopoverContent className="z-[100]">
                        <Calendar
                          mode="single"
                          className="z-auto"
                          selected={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              const formatted = format(date, "yyyy-MM-dd");
                              field.onChange(formatted);
                            }
                          }}
                          locale={es}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />
              <FormField
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 text-sm font-semibold">
                      Fecha de finalización
                      <span className="text-neutral-600 font-normal">(requerido)</span>
                    </FormLabel>
                    <Popover modal>
                      <PopoverTrigger
                        className="flex gap-1 items-center py-2 px-3 w-full form-input-custom justify-start !font-normal disabled:bg-neutral-50"
                        disabled={isDisabled ? true : false}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? field.value : <span>Selecciona una fecha</span>}
                      </PopoverTrigger>
                      <PopoverContent className="z-[100]">
                        <Calendar
                          mode="single"
                          className="z-auto"
                          selected={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              const formatted = format(date, "yyyy-MM-dd");
                              field.onChange(formatted);
                            }
                          }}
                          locale={es}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>

            <FormField
              name="baseRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 text-sm font-semibold">
                    Valor del alquiler
                    <span className="text-neutral-600 font-normal">(requerido)</span>
                  </FormLabel>
                  <Input
                    type="number"
                    className="no-spinner"
                    value={field.value}
                    placeholder="$400000"
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      field.onChange(isNaN(value) ? undefined : value);
                    }}
                    disabled={isDisabled ? true : false}
                  />
                </FormItem>
              )} />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 text-sm font-semibold">
                    Fecha límite de pago
                    <span className="text-neutral-600 font-normal">(requerido)</span>
                  </FormLabel>
                  {/*//Componentizar esto nestor */}
                  <FormControl>
                    <div className="flex items-center gap-2 border-2 rounded-sm p-2 border-gray-300 w-[9rem] mt-2">
                      <span>{field.value}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          field.onChange(Math.max(1, Number(field.value) - 1))
                        }
                        disabled={isDisabled ? true : false}
                      >
                        <Minus size={16} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => field.onChange(Number(field.value) + 1)}
                        disabled={isDisabled ? true : false}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold">
                      ¿Pagó garantía?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={(field.value && field.value > 0) ? "1" : "0"}
                        className="flex gap-4"
                        disabled={isDisabled ? true : false}
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="1" />
                          </FormControl>
                          <FormLabel className="font-normal">Pagó</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="0" />
                          </FormControl>
                          <FormLabel className="font-normal">No pagó</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 text-sm font-semibold">
                      Valor del depósito
                      <span className="text-neutral-600 font-normal">(requerido)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="$"
                        {...field}
                        disabled={isDisabled ? true : false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="adjustmentFrequency"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold">
                    ¿Cada cuánto se ajustará el valor del alquiler?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-6"
                      disabled={isDisabled ? true : false}
                    >
                      {Object.values(AdjustmentFrequency).map((freq) => (
                        <FormItem key={freq} className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={freq} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {freq.charAt(0) + freq.slice(1).toLowerCase()}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <section className="flex justify-between items-center gap-4">
              <FormField
                control={form.control}
                name="adjustmentType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold">
                      Método de actualización
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-10"
                        disabled={isDisabled ? true : false}
                      >
                        {Object.values(AdjustmentType).map((method) => (
                          <FormItem key={method} className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={method} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {method === AdjustmentType.FIJO ? "% Fijo" : method}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Porcentaje fijo */}
              <FormField
                control={form.control}
                name="adjustmentPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 text-sm font-semibold">
                      % Fijo
                      <span className="text-neutral-600 font-normal"> (requerido)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="no-spinner w-[22rem]"
                        placeholder='%'
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                        disabled={form.watch("adjustmentType") !== AdjustmentType.FIJO || isDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <div className="flex flex-col gap-2 justify-center items-center mt-6">
              <Button
                type="submit"
                className="w-[45rem] mt-6 bg-brand-800 flex items-center justify-center gap-2 text-white hover:bg-brand-700"
                disabled={isDisabled ? true : false}
              >
                <SaveIcon />
                Guardar
              </Button>

              <Button type="button" className="col-span-2 btn-secondary w-full" onClick={() => handleDisable()}>
                <PencilLine />
                {isDisabled ? "Editar" : "Cancelar"}
              </Button>

              <Button onClick={() => handleDelete(contract.id)} type="button" className="w-full col-span-2 btn-tertiary" disabled={!isDisabled ? true : false}>
                <X />
                Eliminar
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="documents"
            render={({ field }) => (
              <FormItem className="bg-white px-6 border-l-2 border-neutral-200">
                <FormLabel className="text-xl font-semibold mb-4">Documentación</FormLabel>
                <div className="space-y-2">
                  <FormLabel className="text-sm font-semibold">Subir Documento</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        field.onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form >
    </>
  )
}

export default CreateContractForm