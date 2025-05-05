import { GoogleLoginButton } from "../components/GoogleLoginButton";
import LoginForm from "../components/LoginForm";
import loginBackground from "../assets/loginBackground.webp";

const Login = () => {
  return (
    <div className="flex">
      <section
        className="w-3/4 h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBackground})` }}
      />
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <a
          href="/register"
          className="absolute top-10 right-20 text-[#1E40AF] underline"
        >
          Registrarse
        </a>
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
            <a href="#" className="underline hover:text-emerald-600">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
