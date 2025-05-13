import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import { Send } from "lucide-react"
import Form from "../assets/form.png"

export default function ContactSection() {
  return (
    <section className="px-6 py-16 bg-white flex flex-col items-center">
      <h1 className="text-xl md:text-3xl mb-12 w-full md:w-1/2 text-center  break-words">
        <span className="text-[#1E40AF]">Contáctanos</span> ahora y descubre cómo optimizar tu gestión.
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <form className="space-y-4">
          <Input type="text" placeholder="Nombre y Apellido" />
          <Input type="email" placeholder="Correo Electrónico" />
          <Input type="tel" placeholder="Teléfono" />
          <Textarea placeholder="Mensaje" className="resize-none" rows={4} />
          <Button type="submit" className="flex items-center gap-2 bg-[#1E40AF]">
             <Send className="w-4 h-4" />
            Enviar
          </Button>
        </form>

        <div className="flex justify-center">
          <img
            src={Form}
            alt="Contacto"
            className="max-w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
