import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Iniciando sesión con:", formData)
    localStorage.setItem("token", "vnajkjnaflakfkafmlamfneal2341nakfva");
    navigate("/dashboard");
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8 pt-5">Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="correo@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-md shadow-md transition"
            >
              Iniciar sesión
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              ¿No tenés cuenta? <a href="/register" className="underline hover:text-emerald-600">Registrate</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login