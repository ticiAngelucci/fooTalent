import { Button } from "@/shared/components/ui/button";

const Navbar = () => {
  return (
    <nav className="w-full px-6 md:px-12 py-4 shadow-none flex items-center justify-between bg-white">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
        <span className="font-bold text-lg text-[#0F172A]">Rentary</span>
      </div>
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8 text-sm font-medium ">
        <a href="#inicio" className="!font-bold !text-[#0F172A] hover:!text-blue-600 transition-colors">Inicio</a>
        <a href="#funcionalidades" className="!font-bold !text-[#0F172A] hover:!text-blue-600 transition-colors">Funcionalidades</a>
        <a href="#contacto" className="!font-bold !text-[#0F172A] hover:!text-blue-600 transition-colors">Contacto</a>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="text-sm px-4 py-2">Contáctanos</Button>
        <Button className="bg-[#1E40AF] text-white text-sm px-4 py-2">Probar demo</Button>
      </div>
    </nav>
  );
};

export default Navbar;
