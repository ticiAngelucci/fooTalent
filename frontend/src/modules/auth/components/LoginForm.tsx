import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../schemas/login.schemas";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { MdErrorOutline } from "react-icons/md";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { userLogin } from "../services/authService";
import { Route } from "@/shared/constants/route";
import Spinner from "./Spinner";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const inputClass =
    "text-black placeholder:text-gray-400 bg-white border border-gray-400 rounded-[4px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-black autofill:!bg-white autofill:!text-black autofill:!shadow-[inset_0_0_0_1000px_white] [color-scheme:light]";

  const navigate = useNavigate();
  const storeLogin = useUserStore((state) => state.login);
  const getUser = useUserStore((state) => state.getCredentials);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      if (loginError) setLoginError("");
    });
    return () => subscription.unsubscribe();
  }, [form, loginError]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const login = await userLogin(data);
      const { token } = login;
      if (token) {
        storeLogin(token);
        await getUser();
        navigate(Route.Dashboard);
        setLoginError("");
      }
    } catch {
      setLoginError("Correo o contraseña incorrectos");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  {...field}
                  className={inputClass}
                />
              </FormControl>
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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    {...field}
                    className={inputClass}
                  />

                  {
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  }
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {(loginError ||
          (form.formState.isSubmitted && !form.formState.isValid)) && (
          <div className="flex items-center gap-1 text-red-500 text-sm ml-1 -mt-2">
            <MdErrorOutline size={16} />
            <span className="text-xs">
              Contraseña o correo electrónico incorrecto
            </span>
          </div>
        )}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full cursor-pointer mt-3 rounded-[7px] bg-[#1E40AF] text-white hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {form.formState.isSubmitting && <Spinner />}
          {form.formState.isSubmitting
            ? "Procesando..."
            : "Entrar con correo electrónico"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
