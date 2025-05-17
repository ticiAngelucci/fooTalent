import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordFormValues, resetPasswordSchema } from "../schemas/ResetPassword";
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Link } from "react-router-dom";
import { Route } from "@/shared/constants/route";

interface FormResetPasswordProps {
  onSubmit: (data: ResetPasswordFormValues) => void;
}

export const FormResetPassword = ({ onSubmit }: FormResetPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswordMatch, setShowPasswordMatch] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Validar la contraseña en tiempo real
  const watchPassword = form.watch("password");
  const watchConfirmPassword = form.watch("confirmPassword");

  useEffect(() => {
    // Verificar todos los requisitos
    const hasMinLength = watchPassword.length >= 8;
    const hasMaxLength = watchPassword.length <= 16;
    const hasUpperCase = /[A-Z]/.test(watchPassword);
    const hasNumber = /[0-9]/.test(watchPassword);

    setIsPasswordValid(hasMinLength && hasMaxLength && hasUpperCase && hasNumber);
  }, [watchPassword]);

  // Validar que las contraseñas coincidan
  useEffect(() => {
    if (watchConfirmPassword) {
      setPasswordsMatch(watchPassword === watchConfirmPassword);
      setShowPasswordMatch(true); // Mostrar estado de coincidencia cuando se ha escrito algo en el segundo campo
    } else {
      setPasswordsMatch(true);
      setShowPasswordMatch(false); // No mostrar mensajes si el segundo campo está vacío
    }
  }, [watchPassword, watchConfirmPassword]);

  const handleSubmit = (data: ResetPasswordFormValues) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center mb-6">
        <Link to={Route.Login}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1e40af]">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">Restablece tu contraseña</h2>

      <p className="text-base text-gray-600 mb-8 text-center">
        Ingresa una nueva contraseña.<br />
        Esta debe tener mínimo 8 caracteres y máximo 16 caracteres, al menos 1 mayúscula y 1 número.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    Ingresa nueva contraseña
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=""
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 12s3.6-9 10-9 10 9 10 9-3.6 9-10 9-10-9-10-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 12s3.6-9 10-9 10 9 10 9-3.6 9-10 9-10-9-10-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password ? (
                    <div className="text-sm text-red-500 mt-1">
                      {form.formState.errors.password?.message}
                    </div>
                  ) : isPasswordValid && watchPassword && (!showPasswordMatch || passwordsMatch) ? (
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Contraseña válida
                    </div>
                  ) : null}
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    Repite nueva contraseña
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=""
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 12s3.6-9 10-9 10 9 10 9-3.6 9-10 9-10-9-10-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 12s3.6-9 10-9 10 9 10 9-3.6 9-10 9-10-9-10-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword ? (
                    <div className="text-sm text-red-500 mt-1">
                      {form.formState.errors.confirmPassword?.message}
                    </div>
                  ) : showPasswordMatch ? (
                    passwordsMatch ? (
                      <div className="flex items-center text-sm text-green-600 mt-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                          <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Las contraseñas coinciden
                      </div>
                    ) : (
                      <div className="mt-1">
                        <p className="text-sm text-red-500 font-medium">Las contraseñas no coinciden. Intenta de nuevo:</p>
                        <ul className="text-sm text-red-500 list-disc pl-5 mt-1">
                          <li>Asegúrate de que ambas contraseñas sean exactamente iguales.</li>
                          <li>Verifica que no haya espacios extra al principio o al final.</li>
                        </ul>
                      </div>
                    )
                  ) : null}
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full bg-[#1E40AF] hover:bg-blue-800 text-white py-3 rounded-lg font-medium text-base mt-2">
            Restablecer contraseña
          </Button>
        </form>
      </Form>
    </div>
  );
};
