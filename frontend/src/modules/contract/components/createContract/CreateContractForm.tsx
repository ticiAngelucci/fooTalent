import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ContractFormData, ContractSchema } from '../../schemas/contract.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createContract, fetchOwners, fetchProperties, fetchTenants } from '../../services/createContractService'
import { Owner } from '../../types/owner'
import { Tenant } from '../../types/tenant'
import { Property } from '../../types/property'
import { useUserStore } from '@/store/userStore'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Button } from '@/shared/components/ui/button'
import { CalendarIcon, Minus, Plus, SaveIcon } from 'lucide-react'
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

const CreateContractForm = () => {
    const [owners, setOwners] = useState<Owner[]>([]);
    const [ownerId, setOwnerId] = useState<string>();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [hasPaidGuarantee, setHasPaidGuarantee] = useState<boolean>(false);


    const token = useUserStore.getState().token;

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            const [ownersData, tenantsData] = await Promise.all([
                fetchOwners(),
                fetchTenants(),
            ]);

            setOwners(ownersData.content);
            setTenants(tenantsData.dto);
        };
        loadData();
    }, [token]);

    useEffect(() => {
        const getOwnerProperties = async () => {
            if (ownerId) {
                const propertyList = await fetchProperties(ownerId);
                if (propertyList && propertyList.length > 0) {
                    setProperties(propertyList)
                }
            }
        }
        getOwnerProperties();
    }, [ownerId])


    const form = useForm<ContractFormData>({
        resolver: zodResolver(ContractSchema),
        defaultValues: {
            baseRent: 0,
            deadline: 1,
            deposit: 0,
            // adjustmentPercentage: 
        }
    })

    const adjustmentType = form.watch("adjustmentType");

    useEffect(() => {
        if (adjustmentType !== AdjustmentType.FIJO) {
            form.setValue("adjustmentPercentage", 0);
        }
    }, [adjustmentType, form]);

    const handleSubmit = async (data: ContractFormData) => {
        try {
            console.log("Datos a enviar", data);
            const formDataToSend = new FormData();
            const contractBlob = new Blob([JSON.stringify(data)], {
                type: "application/json",
            });
            formDataToSend.append("contract", contractBlob);

            await createContract(formDataToSend);

            toast.custom(() => (
                <SuccessToast
                    title="¡Contrato creado!"
                    description="El contrato se guardó correctamente."
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
                                        value={ownerId || ""}
                                        onValueChange={(val) => setOwnerId(val)}
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
                                                onValueChange={(val) => field.onChange(Number(val))}>
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
                                        onValueChange={(val) => field.onChange(Number(val))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar inmueble">
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
                                            >
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
                                            >
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
                                        placeholder="$400000"
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            field.onChange(isNaN(value) ? undefined : value);
                                        }}
                                    />
                                    <FormMessage />
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
                                    <FormControl>
                                        <div className="flex items-center gap-2 border-2 rounded-sm p-2 border-gray-300 w-[9rem] mt-2">
                                            <span>{field.value}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    field.onChange(Math.max(1, Number(field.value) - 1))
                                                }
                                            >
                                                <Minus size={16} />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => field.onChange(Number(field.value) + 1)}
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
                            <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold">¿Pagó garantía?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(val) => setHasPaidGuarantee(val === "1")}
                                        className="flex gap-4"
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
                            </FormItem>

                            {/* Campo de depósito controlado por react-hook-form */}
                            <FormField
                                name="deposit"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mb-2 text-sm font-semibold">
                                            Valor del depósito
                                            <span className="text-neutral-600 font-normal">(requerido)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                            className='no-spinner'
                                                type="number"
                                                placeholder="$"
                                                {...field}
                                                onChange={(e) => {
                                                    const numberValue = parseInt(e.target.value, 10);
                                                    field.onChange(isNaN(numberValue) ? undefined : numberValue);
                                                }}
                                                disabled={!hasPaidGuarantee}
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
                                                onChange={(e) => {
                                                    const value = parseFloat(e.target.value);
                                                    field.onChange(isNaN(value) ? 0 : value);
                                                }}
                                                disabled={form.watch("adjustmentType") !== AdjustmentType.FIJO}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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