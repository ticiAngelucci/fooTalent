import { GoogleLoginButton } from "../components/GoogleLoginButton";
import RegisterForm from "../components/RegisterForm";
import frameRegister from "../assets/registro.webp";
import { Link} from "react-router-dom";
import { Route } from "@/shared/constants/route";

const Register = () => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden lg:block lg:w-full min-h-screen bg-brand-200 text-center relative overflow-hidden">
        <Link to={Route.Home}>
          <img src="/Logo.svg" alt="" className="absolute top-10 left-10" />
        </Link>
        <p className="mt-42 text-5xl font-bold text-start px-10 mx-auto relative z-50 justify-start">
          <span className="text-brand-800">Gestiona</span> tus alquileres de
          forma <span className="text-brand-800">fácil</span> y{" "}
          <span className="text-brand-800">eficiente</span>
        </p>
        <img
          src={frameRegister}
          alt="Imagen de edificio"
          className="absolute z-20 -right-20 bottom-10 scale-150"
        />
      </section>
      <section className="w-full flex flex-col items-center lg:justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 lg:pt-32 pb-16 min-h-screen">
        <div className="w-full flex justify-around items-center">
          <Link to={Route.Home}>
            <img
              src="/Logo.svg"
              alt="Logo Rentary"
              className="lg:hidden size-38"
            />
          </Link>
          <a
            href="/login"
            className=" text-[#1E40AF] !underline lg:absolute lg:top-10 lg:right-20"
          >
            Iniciar sesión
          </a>
        </div>
        <div className=" w-full max-w-md px-6">
          <h2 className="text-2xl text-black mb-2 pt-5 cursor-default">
            Crear cuenta
          </h2>
          <p className="text-gray-500 text-sm mb-6 cursor-default">
            Ingresa tus datos para crear una cuenta
          </p>
          <RegisterForm />
          <div className="flex items-center gap-4 my-4">
            <div className="flex-grow h-px bg-gray-300 cursor-default"></div>
            <span className="text-sm text-gray-500 cursor-default">
              Continuar con
            </span>
            <div className="flex-grow h-px bg-gray-300 cursor-default"></div>
          </div>
          <GoogleLoginButton />
          <div className="flex justify-center mt-4">
            <p className="text-center mt-4 text-xs text-gray-500 cursor-default">
              Al hacer clic en continuar, acepta nuestros Términos de servicio y
              Política de privacidad.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
