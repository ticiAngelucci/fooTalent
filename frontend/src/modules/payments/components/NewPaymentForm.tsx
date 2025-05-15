import { useForm } from "react-hook-form"
import { PaymentFormData, PaymentSchema } from "../schemas/payment.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Currency, PaymentMethod, ServiceType } from "../enums/PaymentEnums"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import { CalendarIcon, Save } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale";

import { createPayment } from "../service/paymentService"
import { toast } from "sonner"
import SuccessToast from "@/shared/components/Toasts/SuccessToast"
import ErrorToast from "@/shared/components/Toasts/ErrorToast"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Calendar } from "@/shared/components/ui/calendar"

//If Rent value is the one to go, amount cannot exceed that value

interface Props{
  id: string;
}

const NewPaymentForm = ({id}: Props) => {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      contractId: parseInt(id),
      amount: 0.0,
      paymentDate: "",
      serviceType: undefined,
      paymentMethod: undefined,
      currency: undefined,
      description: ""
    }
  })

  const onSubmit = async (data: PaymentFormData) => {
    try {
      console.log("Datos de pago a enviar", data);
      await createPayment(data);
      toast.custom(
        () => (
          <SuccessToast title="¡Pago agregado con éxito!"
            description="Los datos del pago han sido registrados." />
        ),
        {
          duration: 5000,
        }
      )

    } catch (error) {
      toast.custom(
        () => (
          <ErrorToast title="¡Error al ingresar el pago!"
            description="El pago no ha sido ingresado, por favor inténtelo nuevamente." />
        ),
        {
          duration: 5000,
        }
      )
    }
  }

  return (
    <>
      <h4 className="text-base font-semibold text-neutral-950">Detalle de pago</h4>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit, (errors) => console.error("Errores de validación", errors))}>
          <FormField
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label-custom">
                  Concepto
                  <span className="text-neutral-600 font-normal">(Requerido)</span>
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}>
                    <SelectTrigger className="w-full form-input-custom">
                      <SelectValue placeholder="Seleccione una Opción" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ServiceType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.split("_").join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="paymentDate"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="form-label-custom">Fecha de pago</FormLabel>
                <Popover modal>
                  <PopoverTrigger className="flex gap-1 items-center py-2 px-3 w-full form-input-custom justify-start !font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? field.value : <span>Selecciona una fecha</span>}
                  </PopoverTrigger>
                  <PopoverContent className="z-[100]">
                    <Calendar
                      mode="single"
                      className="z-auto"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const formatted = format(date, "yyyy-MM-dd");
                          field.onChange(formatted);
                        }
                      }}
                      locale={es}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <FormField
              name="amount"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="form-label-custom">Monto abonado</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full form-input-custom no-spinner"
                      type="number"
                      placeholder="$300.000"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="currency"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="form-label-custom">Tipo moneda:</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}>
                      <SelectTrigger className="w-full form-input-custom">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Currency).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.split("_").join(" ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="form-label-custom">Método de pago</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}>
                      <SelectTrigger className="w-full form-input-custom">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PaymentMethod).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.split("_").join(" ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel className="form-label-custom">
                  Notas/comentarios
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      className="min-h-32"
                      maxLength={300}
                      placeholder="Escriba aquí"
                      {...field}
                    />
                    <div className="absolute bottom-1 right-2 text-xs text-muted-foreground">
                      {field.value?.length ?? 0}/{300}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="col-span-2 flex items-center w-full text-base btn-primary">
            <Save className="size-6 mr-2" /> Guardar
          </Button>
        </form>
      </Form >
    </>
  )
}

export default NewPaymentForm