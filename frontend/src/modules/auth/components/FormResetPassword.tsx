import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordFormValues, resetPasswordSchema } from "../schemas/ResetPassword";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { EyeIcon, EyeOff } from "lucide-react";

interface FormResetPasswordProps {
  onSubmit: (data: ResetPasswordFormValues) => void;
}

export const FormResetPassword = ({ onSubmit }: FormResetPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const handleSubmit = (data: ResetPasswordFormValues) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3.5 12.5c0-4.136 0-6.205 1.317-7.514C6.134 3.678 8.225 3.678 12.409 3.678c.305 0 .549.226.746.473.215.271.43.543.746.543.317 0 .532-.272.747-.543.197-.247.44-.473.746-.473 4.184 0 6.275 0 7.592 1.308C24.303 6.295 24.303 8.364 24.303 12.5c0 4.135 0 6.205-1.317 7.514-1.317 1.308-3.408 1.308-7.592 1.308-4.184 0-6.275 0-7.591-1.308C6.486 18.705 6.486 16.636 6.486 12.5h-2.986Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      
      <h1 className="text-center text-xl font-semibold mb-2">Restablece tu contraseña</h1>
      
      <p className="text-center text-sm text-gray-600 mb-6">
        Ingresa una nueva contraseña.
        Esta debe tener mínimo 8 caracteres y máximo 16 caracteres, al menos 1 mayúscula y 1 número.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="Ingresa nueva contraseña"
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="Repite nueva contraseña"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pr-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Restablecer contraseña
          </Button>
        </form>
      </Form>
    </div>
  );
};
