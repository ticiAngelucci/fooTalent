import { adaptRegisterData } from "../adapters/authAdapters";
import { userRegister } from "../services/authService";
import { Route } from "@/shared/constants/route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "../schemas/register.schema";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";


const RegisterForm = () => {

    const navigate = useNavigate();


    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
          name: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
      });
    
      const onSubmit = async (data: RegisterFormValues) => {
        try {
          const cleanData = adaptRegisterData(data);
          const register = await userRegister(cleanData);
          if (register.success == true) {
            navigate(Route.Login);
          }
        } catch (error) {
          alert(error);
        }
      };
    
      const inputClass =
        "text-black placeholder:text-gray-500 border border-gray-400 rounded-[7px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-black autofill:shadow-[inset_0_0_0px_1000px_white]";
    

  return (
    <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3 w-full"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Nombre"
                        {...field}
                        className={`${inputClass}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm ml-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Apellido"
                        {...field}
                        className={`${inputClass}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm ml-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Correo electrónico"
                        {...field}
                        className={`${inputClass}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm ml-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Contraseña"
                        {...field}
                        className={`${inputClass}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm ml-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirmar contraseña"
                        {...field}
                        className={`${inputClass}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm ml-2" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-3 rounded-[7px] bg-black text-white hover:bg-gray-900 focus:ring focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white shadow-sm cursor-pointer"
              >
                Registrarse
              </Button>
            </form>
          </Form>
  )
}

export default RegisterForm