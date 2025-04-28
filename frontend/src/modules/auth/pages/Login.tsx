import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../schemas/login.schemas";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { userLogin } from "../services/authService";
import { Route } from "@/shared/constants/route";

const Login = () => {
  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const login = await userLogin(data);
      //const { token, username } = login; (tenemos que esperar el endpoint de user/me para mostrar el username en lugar de decodificarlo)
      const { token } = login; 

      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(atob(base64));
        console.log(decodedPayload);
        setUser(token, decodedPayload.sub || "Usuario");
      }
  
  
      navigate(Route.Dashboard);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error al iniciar sesión");
      }
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8 pt-5">
            Iniciar sesión
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="correo@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                ¿No tenés cuenta?{" "}
                <a href="/register" className="underline hover:text-emerald-600">
                  Registrate
                </a>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
