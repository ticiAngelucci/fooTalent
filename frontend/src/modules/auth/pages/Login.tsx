import { GoogleLoginButton } from "../components/GoogleLoginButton";
import LoginForm from "../components/LoginForm";
import loginFrame from "../assets/iniciar.webp";
import { Link } from "react-router-dom";
import { Route } from "@/shared/constants/route";


const Login = () => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden lg:block lg:w-full min-h-screen bg-brand-200 text-center relative overflow-hidden">
        <img src="/Logo.svg" alt="" className="absolute top-10 left-10" />
        <p className="mt-42 text-5xl font-bold text-start px-10 mx-auto relative z-50 justify-start">
          <span className="text-brand-800">Gestiona</span> tus alquileres de
          forma <span className="text-brand-800">fácil</span> y{" "}
          <span className="text-brand-800">eficiente</span>
        </p>
        <img
          src={loginFrame}
          alt="Imagen de edificio"
          className="absolute bottom-0 z-20 -right-20 scale-150"
          />
      </section>
      <section className="w-full flex flex-col items-center lg:justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 lg:pt-32 lg:pb-56 min-h-screen">
        <div className="w-full flex justify-around items-center">
          <img src="/Logo.svg" alt="Logo Rentary" className="lg:hidden size-38"/>
          <a href="/register" className=" text-[#1E40AF] lg:absolute lg:top-10 lg:right-20 underline">
            Registrarse
          </a>
        </div>
        <div className="w-full max-w-md px-6">
          <h2 className="text-2xl text-gray-900 mb-2 pt-5 cursor-default">
            Iniciar sesión
          </h2>
          <p className="text-gray-500 text-sm mb-6 cursor-default">
            Ingresa tu mail y contraseña para entrar a la plataforma
          </p>
          <LoginForm />
          <div className="flex items-center gap-4 my-4">
            <div className="flex-grow h-px bg-gray-300 cursor-default"></div>
            <span className="text-sm text-gray-500 cursor-default">
              Continuar con
            </span>
            <div className="flex-grow h-px bg-gray-300 cursor-default"></div>
          </div>

          <GoogleLoginButton />

          <div className="text-center mt-6 text-sm text-[#1E40AF] cursor-default">
            <Link to={Route.ForgotPassword} className="underline hover:text-emerald-600">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
