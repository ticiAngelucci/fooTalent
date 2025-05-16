import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import { Send } from "lucide-react"
import Form from "../assets/form.png"

export default function ContactSection() {
  return (
    <section id="contacto" className="px-6 py-16 bg-white flex flex-col items-center">
      <h1 className="text-xl md:text-3xl mb-12 w-full md:w-1/2 text-center  break-words">
        <span className="text-[#1E40AF]">Contáctanos</span> ahora y descubre cómo optimizar tu gestión.
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <form className="space-y-6 w-full max-w-md mx-auto">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-black">
              Nombre y apellido
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Introduce tu nombre y apellido"
              className="w-full px-4 py-2 border border-gray-300 rounded !bg-white placeholder-gray-400 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-black">
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Introduce tu correo electrónico"
              className="w-full px-4 py-2 border border-gray-300 rounded !bg-white placeholder-gray-400 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-black">
              Teléfono
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="Introduce tu número de teléfono"
              className="w-full px-4 py-2 border border-gray-300 rounded !bg-white placeholder-gray-400 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 text-sm font-medium text-black">
              Mensaje
            </label>
            <Textarea
              id="message"
              placeholder="Déjanos aquí tu consulta..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded !bg-white placeholder-gray-400 text-gray-900 resize-none"
            />
          </div>

          <Button
            type="submit"
            className="flex items-center justify-center gap-2 w-50 px-6 py-2 bg-[#1E40AF] text-white rounded hover:bg-[#1E3A8A] transition-colors"
          >
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
