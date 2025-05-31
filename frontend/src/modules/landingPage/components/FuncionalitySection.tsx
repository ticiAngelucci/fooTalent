import F1 from "../assets/f1.png"
import F2 from "../assets/f2.png"
import F3 from "../assets/f3.png"
import F4 from "../assets/f4.png"

const features = [
  {
    image: F1,
    title: "Administra tus propiedades",
    subtitle:
      "Agrega inmuebles con todos los datos clave del propietario, ubicación, tipo y notas importantes.",
  },
  {
    image: F2,
    title: "Centraliza tus contactos",
    subtitle:
      "Guarda y gestiona la información completa de propietarios e inquilinos en un solo lugar.",
  },
  {
    image: F3,
    title: "Contratos siempre actualizados",
    subtitle:
      "Crea contratos de alquiler con ajustes automáticos según % fijo o ICL y finalización programada.",
  },
  {
    image: F4,
    title: "Control total de pagos",
    subtitle:
      "Registra pagos de alquiler, luz, agua y otros servicios con seguimiento detallado.",
  },
];

const FuncionalitySection = () => {
  return (
    <section id="funcionalidades" className="px-6 py-12 text-center flex flex-col items-center">
      <h1 className="text-xl md:text-3xl mb-12 w-full md:w-1/2 text-center  break-words">
        Descubre algunas de nuestras{" "}
        <span className="text-[#1E40AF]">funcionalidades</span>{" "}
        principales
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-left text-left">
            <img
              src={feature.image}
              alt={feature.title}
              className="h-[350px] w-auto object-contain"
            />
            <h3 className="text-lg mb-2 font-bold">{feature.title}</h3>
            <p className="text-gray-500 max-w-md">{feature.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FuncionalitySection;
