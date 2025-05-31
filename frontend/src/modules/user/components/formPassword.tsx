import React, { useState } from "react";
import { Eye, EyeOff, X, CircleAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { passwordFormValue, passwordSchema } from "../schemas/passwordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { changePassword } from "../services/userService";
import { MdCheckCircle } from "react-icons/md";
import Spinner from "./Spinner";

type FormPasswordProps = {
  onCloseEdit: () => void;
  onModifiedPassword: () => void;
};

const FormPassword: React.FC<FormPasswordProps> = ({
  onCloseEdit,
  onModifiedPassword,
}) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClickOld = () => {
    setShowOldPassword(!showOldPassword);
  };
  const handleClickNew = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleClickConfirm = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const form = useForm<passwordFormValue>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const renderError = (message?: string) =>
    message && (
      <div className="mt-2 text-red-600 text-sm">
        {message.split("\n").map((line, idx) => (
          <p key={idx}>{line.trim()}</p>
        ))}
      </div>
    );

  const onSubmit = async (data: passwordFormValue) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      await changePassword(payload);
      onModifiedPassword();
      setError("");
    } catch {
      setError("No coincide con la contraseña actual");
      throw new Error("Error al cambiar contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (data: passwordFormValue) => {
    onSubmit(data);
  };

  return (
    <div className="relative w-[576px] bg-white m-auto p-4 border rounded-[8px] border-neutral-200">
      <button
        onClick={onCloseEdit}
        className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
      >
        <X className="h-[24px] w-[24px]"></X>
      </button>
      <p className="font-raleway ml-[20px] font-semibold text-[16px] leading-[24px] tracking-[0%] [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums] mt-[10px] mb-[5px]">
        Cambiar contraseña
      </p>
      <p className="ml-[20px] text-neutral-600 font-raleway font-normal text-[14px] leading-[22px] tracking-[0%] [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums]">
        Ingresa los datos solicitados
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col items-center p-4"
        >
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <label className="mb-1 font-raleway font-semibold text-sm">
                  Contraseña actual
                </label>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showOldPassword ? "text" : "password"}
                      className="font-raleway font-normal text-base leading-6 tracking-normal [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums] h-10 rounded-[4px] w-full border border-neutral-300 px-2 pr-10 focus:outline-none focus:ring-0 focus:border-neutral-300"
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger("newPassword");
                        setError("")
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={handleClickOld}
                    >
                      {showOldPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 font-raleway font-normal text-[14px] leading-[22px] tracking-[0%] [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums] whitespace-pre-line flex items-center">
                  {error && (
                    <>
                      <CircleAlert className="w-4 h-4 mr-1" />
                      {error}
                    </>
                  )}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <label className="mt-4 font-raleway font-semibold text-sm text-neutral-950">
                  Nueva contraseña
                </label>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showNewPassword ? "text" : "password"}
                      className={`font-raleway font-normal text-base leading-6 tracking-normal 
              [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums] 
              h-10 w-full rounded-[4px] px-2 pr-10 focus:outline-none focus:ring-0 
              ${
                !form.formState.errors.newPassword && field.value
                  ? "border-green-500"
                  : "border-neutral-300"
              }`}
                      maxLength={25}
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger("confirmPassword");
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={handleClickNew}
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                {form.formState.errors.newPassword && (
                  <FormMessage className="text-red-500 font-raleway font-normal text-[14px] leading-[22px] tracking-[0%] [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums] whitespace-pre-line">
                    {form.formState.errors.newPassword?.message}
                  </FormMessage>
                )}
                {!form.formState.errors.newPassword && field.value && (
                  <FormMessage className="text-green-600 font-raleway font-normal text-[14px] leading-[22px] tracking-[0%] [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums] flex items-center">
                    <MdCheckCircle size={18} className="mr-1" />
                    Contraseña válida
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <label className="mt-4 font-raleway font-semibold text-sm text-neutral-950">
                  Repetir nueva contraseña
                </label>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      className={`font-raleway font-normal text-base leading-6 tracking-normal [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums] h-10 w-full rounded-[4px] px-2 pr-10 
              focus:outline-none focus:ring-0 
              ${
                !form.formState.errors.confirmPassword && field.value
                  ? "border-green-500"
                  : "border-neutral-300"
              }`}
                      maxLength={25}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={handleClickConfirm}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                {form.formState.errors.confirmPassword && (
                  <FormMessage className="text-red-500 font-raleway font-normal text-[14px] leading-[22px] tracking-[0%] [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums]">
                    {renderError(
                      form.formState.errors.confirmPassword?.message
                    )}
                  </FormMessage>
                )}
                {!form.formState.errors.confirmPassword && field.value && (
                  <FormMessage className="text-green-600 font-raleway font-normal text-[14px] leading-[22px] tracking-[0%] [font-variant-numeric:lining-nums] [font-variant-numeric:proportional-nums] flex items-center">
                    <MdCheckCircle size={18} className="mr-1" />
                    Las contraseñas coinciden
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={`w-40 h-10 text-white rounded-md mt-5 border rounded-[4px] ml-90 
    ${
      isLoading
        ? "bg-brand-700 cursor-not-allowed"
        : "bg-brand-800 hover:bg-brand-700"
    }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner className="text-white" />
                Procesando...
              </div>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormPassword;
