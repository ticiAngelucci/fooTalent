import edificio1 from '../../assets/edificio1.png';
interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="flex">
            <section className="hidden lg:block lg:w-2/3 xl:w-1/2 h-screen bg-brand-200 relative">
                <img src="/Logo.svg" alt="" className="absolute top-10 left-10" />
                <p className="mt-42 text-4xl font-semibold px-10"><span className="text-brand-800">Gestiona</span> tus alquileres de forma <span className="text-brand-800">fácil</span> y <span className="text-brand-800">eficiente</span></p>
                <img src={edificio1} alt="" className="w-4xl absolute bottom-0" />
            </section>
            {children}
        </div>
    )
}

export default AuthLayout;