import { GoogleLoginButton } from "../components/GoogleLoginButton";
import RegisterForm from "../components/RegisterForm";
import Logo from "../assets/Logo.svg";
import edificio2 from "../assets/edificio2.png";

const Register = () => {

  
  return (
    <div className="flex">
      <section className="hidden lg:block lg:w-2/3 xl:w-1/2 h-screen bg-brand-200 relative">
        <img src={Logo} alt="" className="absolute top-10 left-10"/>
        <p className="mt-42 text-4xl font-semibold px-10"><span className="text-brand-800">Gestiona</span> tus alquileres de forma <span className="text-brand-800">fácil</span> y <span className="text-brand-800">eficiente</span></p>
        <img src={edificio2} alt="Logo Rentary" className="w-4xl absolute bottom-0"/>
      </section>
      <section className="w-full h-screen flex flex-col items-center lg:justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <div className="w-full flex justify-around items-center">
          <img src={Logo} alt="Logo Rentary" className="lg:hidden size-38"/>
          <a href="/login" className=" text-[#1E40AF] underline lg:absolute lg:top-10 lg:right-20">
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
