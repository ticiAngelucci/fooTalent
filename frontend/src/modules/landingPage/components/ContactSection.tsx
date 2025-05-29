import { useEffect, useState } from "react"
import { sendContactForm } from "../services/LandingPageServices"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import { MailCheck, Send } from "lucide-react"
import Form from "../assets/form.png"
import { useLocation } from "react-router-dom"

export type ContactFormData = {
  fullName: string
  email: string
  phone: string
  text: string
}

type ContactFormErrors = {
  fullName?: string
  email?: string
  phone?: string
  text?: string
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    text: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<ContactFormErrors>({})

  const location = useLocation()

  const validate = () => {
    const newErrors: ContactFormErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Nombre es requerido"
    if (!formData.email.trim()) {
      newErrors.email = "Correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Teléfono es requerido"
    } else if (!/^\d+$/.test(formData.phone.trim())) {
      newErrors.phone = "El teléfono debe contener solo números"
    }
    if (!formData.text.trim()) newErrors.text = "Mensaje es requerido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id === "message" ? "text" : id]: value,
    }))
    setErrors((prev) => ({ ...prev, [id]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSuccess(false)
    setError("")

    if (!validate()) return

    setLoading(true)

    try {
      await sendContactForm(formData)
      setSuccess(true)
      setFormData({ fullName: "", email: "", phone: "", text: "" })
    } catch {
      setError("Ocurrió un error al enviar el formulario. Inténtalo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }
  }, [location])

  return (
    <section id="contacto" className="px-6 py-16 bg-white flex flex-col items-center">
      <h1 className="text-xl md:text-3xl mb-12 w-full md:w-1/2 text-center break-words">
        <span className="text-[#1E40AF]">Contáctanos</span> ahora y descubre cómo optimizar tu gestión.
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {success ? (
          <div className="w-full max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <MailCheck className="w-16 h-16 text-[#1E40AF]" />
            </div>
            <h2 className="text-3xl  text-center text-gray-800 mb-6">
              Correo enviado
            </h2>

            <div className="text-center mb-8">
              <p className="text-gray-600 mb-2">
                Gracias por ponerte en contacto con nosotros.
              </p>
              <p className="text-gray-600">
                ¡En breve nos estaremos comunicando contigo!
              </p>
            </div>
          </div>
        ) : (
          <form className="space-y-6 w-2/3 max-w-md mx-auto" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block mb-1 text-sm font-medium text-black">
                Nombre y apellido
              </label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Introduce tu nombre y apellido"
                className="w-full"
              />
              {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-black">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Introduce tu correo electrónico"
                className="w-full"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block mb-1 text-sm font-medium text-black">
                Teléfono
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Introduce tu número de teléfono"
                className="w-full"
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block mb-1 text-sm font-medium text-black">
                Mensaje
              </label>
              <Textarea
                id="message"
                value={formData.text}
                onChange={handleChange}
                placeholder="Déjanos aquí tu consulta..."
                rows={4}
                className="w-full min-h-32"
              />
              {errors.text && <p className="text-red-600 text-sm mt-1">{errors.text}</p>}
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-50 px-6 py-2 bg-[#1E40AF] text-white rounded hover:bg-[#1E3A8A] transition-colors"
            >
              <Send className="w-4 h-4" />
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        )}

        <div className="flex justify-center">
          <img src={Form} alt="Contacto" className="max-w-full h-auto rounded-xl shadow-lg" />
        </div>
      </div>
    </section>
  )
}
