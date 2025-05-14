import { useState } from "react";
import { motion } from "framer-motion";
import P1 from "../assets/p2.png";
import P2 from "../assets/p3.png";
import P3 from "../assets/p4.png";

type Testimonial = {
  image: string;
  name: string;
  role: string;
  text: string;
};

const testimonials: Testimonial[] = [
  {
    image: P3,
    name: "Ana López",
    role: "Administradora, Rosario",
    text: "La plataforma es intuitiva y potente. Me permite gestionar múltiples propiedades sin errores ni demoras.",
  },
  {
    image: P2,
    name: "Javier Torres",
    role: "Propietario de inmuebles, Córdoba",
    text: "La automatización de contratos y pagos me cambió la vida. Ya no tengo que preocuparme por actualizaciones o vencimientos, todo se hace solo y con avisos claros.",
  },
  {
    image: P1,
    name: "Marcos Vidal",
    role: "Corredor Inmobiliario, Mendoza",
    text: "Desde que uso este software, mi trabajo es más eficiente y profesional. Los propietarios están más tranquilos.",
  },
];

const TestimonySection = () => {
  const [activeIndex, setActiveIndex] = useState(Math.floor(testimonials.length / 2));

  const prev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-12 px-6 text-center flex flex-col items-center">
      <h1 className="text-2xl md:text-4xl lg:text-5xl leading-snug md:leading-tight mb-4 md:mb-8 w-full md:w-1/2">
        <span className="text-[#1E40AF]">Testimonios</span> de quienes ya optimizan su día a día
      </h1>
      <div className="relative flex items-center justify-center overflow-hidden w-full max-w-xs mx-auto block md:hidden">
        <button onClick={prev} className="absolute left-2 z-10 text-2xl px-2 py-1">
          ‹
        </button>
        <div className="w-full flex justify-center">
          <motion.div
            key={activeIndex}
            className="flex-shrink-0 rounded-xl bg-white shadow p-4 w-full text-center"
          >
            <img
              src={testimonials[activeIndex].image}
              alt={testimonials[activeIndex].name}
              className="w-28 h-28 mx-auto rounded-full mb-4 object-cover"
            />
            <h3 className="font-semibold text-base">{testimonials[activeIndex].name}</h3>
            <p className="text-xs text-gray-500 mb-2">{testimonials[activeIndex].role}</p>
            <p className="text-gray-600 text-sm italic">"{testimonials[activeIndex].text}"</p>
          </motion.div>
        </div>
        <button onClick={next} className="absolute right-2 z-10 text-2xl px-2 py-1">
          ›
        </button>
      </div>
      <div className="relative items-center justify-center overflow-hidden max-w-6xl mx-auto hidden md:flex">
        <button onClick={prev} className="absolute left-0 z-10 text-3xl px-4 py-2">
          ‹
        </button>
        <div className="flex gap-6 overflow-hidden w-full justify-center">
          {testimonials.map((t, index) => {
            const isActive = index === activeIndex;
            const isSide =
              index === (activeIndex + 1) % testimonials.length ||
              index === (activeIndex - 1 + testimonials.length) % testimonials.length;

            return (
              <motion.div
                key={index}
                className={`transition-all duration-300 ease-in-out flex-shrink-0 rounded-xl bg-white shadow-none p-6 w-[300px] md:w-[350px] text-center ${
                  isActive ? "scale-100 blur-0 opacity-100" : isSide ? "scale-95 blur-sm opacity-50" : "hidden"
                }`}
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-40 h-40 mx-auto rounded-full mb-4 object-cover"
                />
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{t.role}</p>
                <p className="text-gray-600 text-sm italic">"{t.text}"</p>
              </motion.div>
            );
          })}
        </div>
        <button onClick={next} className="absolute right-0 z-10 text-3xl px-4 py-2">
          ›
        </button>
      </div>
    </section>
  );
};

export default TestimonySection;
