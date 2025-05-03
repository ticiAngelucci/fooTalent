import { GoogleLoginButton } from "../components/GoogleLoginButton";
import RegisterForm from "../components/RegisterForm";
import registerBackground from "../assets/registerBackground.webp"

const Register = () => {

  
  return (
    <div className="flex">
      <section
        className="w-3/4 h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${registerBackground})` }}
      />
      <section className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <a href="/login" className="absolute top-10 right-20 text-[#1E40AF] underline">
          Iniciar sesión
        </a>
        <div className="w-full max-w-md px-6">
          <h2 className="text-2xl text-black mb-2 pt-5 cursor-default">
            Crear cuenta
          </h2>
          <p className="text-gray-500 text-sm mb-6 cursor-default">
            Ingresa tus datos para crear una cuenta
          </p>
          <RegisterForm/>
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
