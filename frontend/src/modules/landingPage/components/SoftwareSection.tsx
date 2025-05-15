import img1 from "../assets/1.png"
import img2 from "../assets/2.png"
import img3 from "../assets/3.png"
import img4 from "../assets/4.png"
import img5 from "../assets/5.png"
import img6 from "../assets/6.png"

const SoftwareSection = () => {
  const logos = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
  ];

  return (
    <section className="py-12 px-6 text-center">
      <h2 className="text-xl md:text-2xl  !text-[#000000] mb-10">
        Software utilizado por alguna de las inmobiliarias más importantes del país
      </h2>

     <div className="flex flex-col md:flex-row justify-center items-center gap-8">
  {logos.map((src, index) => (
    <img
      key={index}
      src={src}
      alt={`Logo ${index + 1}`}
      className="h-16 md:h-20 object-contain"
    />
  ))}
</div>
  
    </section>
  );
};

export default SoftwareSection;

