import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#1E3DB2] text-white px-6 md:px-12 py-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
               
                <div className="flex items-center gap-2">
                    <img src="/logo.svg" alt="Rentry Logo" className="h-6" />
                </div>

                <div className="flex gap-6 text-sm">
                    <a href="#" className="!text-white !font-bold">Inicio</a>
                    <a href="#" className="!text-white !font-bold">Funcionalidades</a>
                    <a href="#" className="!text-white !font-bold">Contacto</a>
                </div>
                <div className="flex gap-4">
                    <a href="#"><Facebook className="w-5 h-5 text-white" /></a>
                    <a href="#"><Instagram className="w-5 h-5 text-white" /></a>
                    <a href="#"><Linkedin className="w-5 h-5 text-white" /></a>
                </div>
            </div>


            <hr className="border-white/30 my-6" />
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-white/80 gap-4">
                <p>© 2025 Rentary. Todos los derechos reservados.</p>
                <div className="flex gap-4">
                    <a href="#" className="hover:underline">Política de Privacidad</a>
                    <a href="#" className="hover:underline">Términos de Servicio</a>
                    <a href="#" className="hover:underline">Configuración de Cookies</a>
                </div>
            </div>
        </footer>
    );
}
export default Footer;