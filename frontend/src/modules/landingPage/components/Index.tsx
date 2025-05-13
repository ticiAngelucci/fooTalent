import IndexImg from "../assets/indexImg.png"
const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12">
      <h1 className="text-4xl leading-tight mb-8 w-1/2">
        <span className="text-[#1E40AF]">Gestiona</span>{" "}
        <span >tus propiedades de manera eficiente</span>{" "}
        <span className="text-[#1E40AF]">eficiente y fácil</span>{" "}
      </h1>
      <p className="text-gray-500 max-w-2xl mb-10">
        Nuestra aplicación te permite gestionar contratos, inmuebles y propietarios con total comodidad.
        Simplifica la carga de documentos y mantén actualizados los valores de alquiler automáticamente.
      </p>

      <img
        src={IndexImg}
        alt="Demostración"
       className="w-11/12 max-w-6xl rounded-md shadow-none"
      />
    </div>
  );
};

export default Index;
