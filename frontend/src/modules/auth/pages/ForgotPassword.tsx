import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
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
import { Route } from "@/shared/constants/route";
import { forgotPassword } from "../services/authService";
import axios from "axios";
import { Link } from "react-router-dom";

import { Frown } from 'lucide-react';
import AuthLayout from "../components/layout/AuthLayout";

const forgotPasswordSchema = z.object({
    email: z.string()
        .min(1, "Ingrese un correo electrónico")
        .email("Ingrese un correo electrónico válido"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
    const navigate = useNavigate();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            await forgotPassword(data.email);
            navigate(Route.EmailSendConfirmation, { state: { email: data.email } });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 500) {
                
                sessionStorage.setItem('errorEmail', data.email);
                
                
                navigate(Route.ErrorEmailNotFound, {
                    state: {
                        email: data.email,
                        from: 'forgot_password'
                    },
                    replace: false 
                });
            } else {
                let errorMessage = "Ocurrió un error al enviar el correo";
                if (axios.isAxiosError(error) && error.response) {
                    errorMessage = error.response.data?.message || error.message;
                    console.error(errorMessage);
                }
                
                
                sessionStorage.setItem('errorEmail', data.email || "");
                
                navigate(Route.ErrorEmailNotFound);
            }
        }
    };

    return (
        <AuthLayout>
            <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
                <div className="w-full max-w-md px-6">
                    <div >
                        <div className="flex justify-center mb-4">
                            <Frown className="w-16 h-16 text-[#1E40AF]" />
                        </div>

                        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8 pt-5">
                            ¿Olvidaste tu contraseña?
                        </h2>

                        <p className="text-center text-gray-600 mb-6">
                            Introduce la dirección de correo electrónico y enviaremos un enlace para restablecer tu contraseña.
                        </p>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correo Electrónico</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="correo@example.com"
                                                    {...field}
                                                    className={form.formState.errors.email ? "border-red-500" : ""}
                                                />
                                            </FormControl>
                                            {form.formState.errors.email && (
                                                <FormMessage className="text-red-500 flex items-start gap-1">
                                                    <span className="text-sm">{form.formState.errors.email.message}</span>
                                                </FormMessage>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer mt-3 rounded-[7px] bg-[#1E40AF] text-white hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Enviar correo
                                </Button>

                                <div className="text-center text-sm text-gray-500 mt-4 space-y-2">
                                    <p>
                                        ¿No tienes una cuenta?{" "}
                                        <Link to={Route.Register} className="font-semibold text-[#1E40AF] underline">
                                            Regístrate
                                        </Link>
                                    </p>
                                    <p>
                                        <Link to={Route.Home} className="text-[#1E40AF] underline">
                                            Volver al inicio
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;