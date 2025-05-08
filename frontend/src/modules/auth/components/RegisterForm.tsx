import { useState, useEffect } from "react";
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
  FormLabel,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { MdErrorOutline } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";
import Spinner from "./Spinner";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      if (registerError) setRegisterError("");
    });
    return () => subscription.unsubscribe();
  }, [form, registerError]);

  const onSubmit = async (data: RegisterFormValues) => {
    if (!form.formState.isValid) {
      return;
    }
    try {
      const register = await userRegister(data);
      if (register.success == true) {
        navigate(Route.Login);
        setRegisterError("");
      }
    } catch {
      setRegisterError("El correo está registrado o está mal escrito.");
    }
  };

  const inputClass =
    "placeholder:text-gray-400 text-black bg-white rounded-[4px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-black autofill:!bg-white autofill:!text-black autofill:!shadow-[inset_0_0_0_1000px_white] [color-scheme:light]";

  const renderError = (message?: string) =>
    message && (
      <div className="mt-2 flex gap-1 items-start text-red-600 text-sm">
        <MdErrorOutline className="w-4 h-4 mt-[1px]" />
        <div className="space-y-[2px]">
          {message.split("\n").map((line, idx) => (
            <p key={idx} className="leading-tight text-start">
              {line.trim()}
            </p>
          ))}
        </div>
      </div>
    );

  const renderSuccess = (fieldName: keyof RegisterFormValues) => {
    const touched = form.formState.touchedFields[fieldName];
    const error = form.formState.errors[fieldName];
    const value = form.getValues(fieldName);

    if (!touched || error || !value.trim()) return null;

    const successMessages: Record<keyof RegisterFormValues, string> = {
      firstName: "Nombre válido.",
      lastName: "Apellido válido.",
      email: "Correo electrónico correcto.",
      password: "La contraseña cumple con los estándares de seguridad.",
      confirmPassword: "Las contraseñas coinciden.",
    };

    return (
      <div className="flex gap-1 items-start text-green-600 text-sm">
        <MdCheckCircle className="w-4 h-4 mt-[1px]" />
        <p className="leading-tight text-start">{successMessages[fieldName]}</p>
      </div>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full"
      >
        {(
          [
            "firstName",
            "lastName",
            "email",
            "password",
            "confirmPassword",
          ] as const
        ).map((fieldName) => {
          const fieldError = form.formState.errors[fieldName];
          const isTouched = form.formState.touchedFields[fieldName];
          const hasError = !!fieldError;
          const isValid = isTouched && !hasError;

          return (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {
                      {
                        firstName: "Nombre",
                        lastName: "Apellido",
                        email: "Correo electrónico",
                        password: "Contraseña",
                        confirmPassword: "Confirmar contraseña",
                      }[fieldName]
                    }
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={
                        fieldName === "password" ||
                        fieldName === "confirmPassword"
                          ? "password"
                          : fieldName === "email"
                          ? "email"
                          : "text"
                      }
                      placeholder={
                        fieldName === "email"
                          ? "Ej: rentary@tudominio.ar"
                          : fieldName === "password" ||
                            fieldName === "confirmPassword"
                          ? "***********"
                          : ""
                      }
                      {...field}
                      className={`${inputClass} ${
                        hasError
                          ? "border-red-500 text-red-700"
                          : isValid
                          ? "border-green-500 text-green-700"
                          : "border-gray-400 text-black"
                      }`}
                    />
                  </FormControl>
                  {hasError
                    ? renderError(fieldError?.message)
                    : renderSuccess(fieldName)}
                </FormItem>
              )}
            />
          );
        })}

        <Button
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className="w-full cursor-pointer mt-3 rounded-[7px] bg-[#1E40AF] text-white hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {form.formState.isSubmitting && <Spinner />}
          {form.formState.isSubmitting ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
