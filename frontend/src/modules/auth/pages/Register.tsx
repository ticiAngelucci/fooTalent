

import { GoogleLoginButton } from "../components/GoogleLoginButton";
import RegisterForm from "../components/RegisterForm";

const Register = () => {

  
  return (
    <div className="flex">
      <section className="w-2/3 bg-black" />
      <section className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <a href="/login" className="absolute top-10 right-20 text-gray-900">
          Iniciar sesión
        </a>
        <div className="w-full max-w-md px-6">
          <h2 className="text-2xl font-semibold text-center text-black mb-2 pt-5 cursor-default">
            Crear cuenta
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6 cursor-default">
            Ingresa tus datos para crear una cuenta
          </p>
          <RegisterForm/>
          <div className="flex items-center gap-4 my-4">
            <div className="flex-grow h-px bg-gray-300 cursor-default"></div>
            <span className="text-sm text-gray-500 cursor-default">
              O continuar con
            </span>
            <div className="flex-grow h-px bg-gray-300 cursor-default"></div>
          </div>
          <GoogleLoginButton />
          <div className="flex justify-center mt-4">
            <p className="text-center mt-4 text-xs text-gray-400 cursor-default">
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
