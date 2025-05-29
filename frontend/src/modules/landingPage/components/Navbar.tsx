import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Menu, X } from "lucide-react";
import { Route } from "@/shared/constants/route";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full px-6 md:px-12 py-4 shadow-none flex items-center justify-between bg-white relative z-50">
      <div className="flex items-center gap-2">
        <img src="/Logo.svg" alt="Logo" className="h-9 w-auto" />
      </div>

      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8 text-sm font-medium">
        <a href="#inicio" className="!font-bold !text-[#0F172A] hover:!text-blue-600 transition-colors">Inicio</a>
        <a href="#funcionalidades" className="!font-bold !text-[#0F172A] hover:!text-blue-600 transition-colors">Funcionalidades</a>
        <a href="#testimonios" className="!font-bold !text-[#0F172A] hover:!text-blue-600 transition-colors">Testimonios</a>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <a href="/#contacto" className=""><Button variant="outline" className="btn-secondary text-sm px-4 py-2 border-2 !bg-transparent !rounded-[4px] text-black">Contáctanos</Button></a>
        <Link to={Route.Register}>
          <Button className="btn-primary !rounded-[4px] text-white text-sm px-4 py-2">
            Probar demo
          </Button>
        </Link>
      </div>

      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start p-4 gap-4 md:hidden">
          <a href="#inicio" className="text-sm font-bold !text-[#0F172A]">Inicio</a>
          <a href="#funcionalidades" className="text-sm font-bold !text-[#0F172A]">Funcionalidades</a>
          <a href="#contacto" className="text-sm w-full">
            <Button variant="outline" className="text-sm w-full text-neutral-950">Contáctanos</Button>
          </a>
          <Link to={Route.Register} className="bg-[#1E40AF] text-white text-sm w-full rounded-sm">
            <Button className="bg-[#1E40AF] text-white text-sm w-full">Probar demo</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
