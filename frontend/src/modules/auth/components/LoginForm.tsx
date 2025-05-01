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
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { userLogin } from "../services/authService";
import { Route } from "@/shared/constants/route";

const LoginForm = () => {
  const inputClass =
    "text-black placeholder:text-gray-500 border border-gray-400 rounded-[7px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-black autofill:shadow-[inset_0_0_0px_1000px_white]";

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
      const { token } = login;
      if (token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = JSON.parse(atob(base64));
        setUser(token, decodedPayload.sub || "Usuario");
      }
      navigate(Route.Dashboard);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al iniciar sesión");
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    {...field}
                    className={inputClass}
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
                    className={inputClass}
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
            Entrar con mail
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
