import loginFrame from "../../assets/iniciar.webp";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
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
      {children}
    </div>
  );
};

export default AuthLayout;
