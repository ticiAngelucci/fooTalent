import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Route } from "@/shared/constants/route"
import { useForm } from "react-hook-form"
import { PropertyFormData, PropertySchema } from "../schemas/property.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import { Link } from "react-router-dom"
import { Save, UserPlus } from "lucide-react"
import { createProperty } from "../services/PropertyService"
import { TypeOfProperty } from "../enums/TypeOfProperty"

const PropertyRegister = () => {
    const form = useForm<PropertyFormData>({
        resolver: zodResolver(PropertySchema),
        defaultValues: {
            address: {
                country: "",
                province: "",
                locality: "",
                street: "",
                number: "",
                postalCode: "",
            },
            typeOfProperty: undefined,
            observations: "",
            ownerId: undefined,
        },
    });

    const onSubmit = async (data: PropertyFormData) => {
        try {
            const response = await createProperty(data);
            alert("Propiedad Creada con éxito")
            console.log(response);

        } catch (error) {
            alert("Algo salio mal")
            console.error(error);
        }
    };

    return (
        <DashboardLayout subtitle="Añadir Inmueble" redirect={Route.Dashboard}>
            <section className="p-6 rounded-[8px] border bg-white">
                <Form {...form}>
                    <form className="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <h4 className="text-2xl font-semibold col-span-4">Datos del inmueble</h4>

                        {/* Propietario existente */}
                        <FormField
                            name="ownerId"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormDescription className="text-base text-neutral-950">
                                        Si el propietario ya existe, selecciónalo. Si no, puedes registrarlo ahora.
                                    </FormDescription>
                                    <FormLabel className="form-label-custom">Propietario existente</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value?.toString() || ""}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                        >
                                            <SelectTrigger className="w-full form-input-custom">
                                                <SelectValue placeholder="Seleccione un propietario" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Propietarios</SelectLabel>
                                                    <SelectItem value="1">Juan Ignacio</SelectItem>
                                                    <SelectItem value="2">Homero Simpson</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Agregar nuevo propietario */}
                        <div className="col-span-2 flex flex-col justify-end">
                            <label className="text-sm font-semibold">Agregar Nuevo Propietario</label>
                            <Link className="flex gap-2 text-base text-brand-800" to="#">
                                <UserPlus />
                                <span>Agregar propietario</span>
                            </Link>
                        </div>

                        <FormField
                            name="typeOfProperty"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel className="form-label-custom">
                                        Tipo de Inmueble
                                        <span className="text-neutral-600 font-normal">(Requerido)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value || ""}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full form-input-custom">
                                                <SelectValue placeholder="Seleccione tipo de inmueble" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(TypeOfProperty).map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.split("_").join(" ")}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Dirección */}
                        <h4 className="text-base font-semibold col-span-4">Dirección</h4>

                        <FormField
                            name="address.street"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel className="form-label-custom">
                                        Calle
                                        <span className="text-neutral-600 font-normal">(Requerido)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="form-input-custom" placeholder="Ej: Av. Rivadavia" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="address.number"
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                    <FormLabel className="form-label-custom">
                                        Número
                                        <span className="text-neutral-600 font-normal">(Requerido)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="form-input-custom" placeholder="Ej: 12" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="address.postalCode"
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                    <FormLabel className="form-label-custom">
                                        Código Postal
                                        <span className="text-neutral-600 font-normal">(Requerido)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="form-input-custom" placeholder="Ej: 12154" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="address.locality"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel className="form-label-custom">
                                        Localidad
                                        <span className="text-neutral-600 font-normal">(Requerido)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="form-input-custom" placeholder="Ej: Flores" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="address.country"
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                    <FormLabel className="form-label-custom">
                                        Pais
                                        <span className="text-neutral-600 font-normal">(Requerido)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="form-input-custom" placeholder="Ej: Argentina" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="address.province"
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                    <FormLabel className="form-label-custom">
                                        Provincia
                                        <span className="text-neutral-600 font-normal">(Requerido)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="form-input-custom" placeholder="Ej: Buenos Aires" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Observaciones */}
                        <FormField
                            name="observations"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel className="form-label-custom">
                                        Observaciones
                                        <span className="text-neutral-600 font-normal">(Requerido)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea className="min-h-32 form-input-custom" placeholder="Ej: Escriba aquí" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <br />
                        <Button type="submit" className="col-span-2 flex items-center w-full text-base btn-primary">
                            <Save className="size-6 mr-2" /> Agregar Nuevo Inmueble
                        </Button>
                    </form>
                </Form>

            </section>
        </DashboardLayout>
    )
}

export default PropertyRegister