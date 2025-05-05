import { Button } from "@/shared/components/ui/button";
interface Props {
    title: string;
    subtitle:string;
    type:string;
    items: Array<{
        image: string;
        type: string;
        status: string;
        location: string;
        name: string;
      }>;      
}
const InfoCard = ({ title, subtitle, type, items }:Props) => {
    return (
        <div className="g-white flex flex-col justify-between rounded-lg shadow-none p-4 space-y-4 border border-zinc-200">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <h4 className="font-light text-zinc-500">{subtitle}</h4>
            {items.map((item, index) => {
                return (
                    <div
                        key={index}
                        className="flex items-center gap-4 bg-white rounded-lg shadow-none border border-zinc-200 pt-4 first:border-t-0 first:pt-0"
                    >
                        {type === "property" && item.image && (
                            <img
                                src={item.image}
                                alt={item.type}
                                className="w-30 h-30 object-cover rounded-md mb-5 ml-5"
                            />
                        )}

                        {type === "contact" && (
                            <div className="w-12 h-12 rounded-full bg-[#201E50] flex items-center justify-center mb-5 ml-5 text-white font-bold">
                                {item.name?.[0] || "?"}
                            </div>
                        )}

                        <div className="flex flex-col text-sm text-gray-800 font-medium space-y-1 mb-4 ml-2.5">
                            {type === "contract" && <p >
                                <span className="text-black">Nombre de contrato:</span>
                                <span className="text-gray-500">{item.name}</span>
                            </p>}

                            {type === "property" && (
                                <p>
                                    <span className="text-black">Tipo de inmueble: </span>
                                    <span className="text-gray-500">{item.type}</span>
                                </p>
                            )}

                            {type === "contact" && <p >
                                <span className="text-black">Inquilino:</span>
                                <span className="text-gray-500">{item.type}</span>
                            </p>}

                            <p>
                                <span className="text-black">Ubicación: </span>
                                <span className="text-gray-500">{item.location}</span>
                            </p>

                            {type === "property" && (
                                <span className="mt-1 text-xs text-white bg-green-500 px-2 py-1 rounded-full w-fit">
                                    {item.status}
                                </span>
                            )}
                        </div>
                    </div>

                );
            })}
            <Button
                variant="ghost"
                className="bg-black hover:bg-[#5c5b64] w-full text-white h-10 rounded-xl p-2 text-center mt-auto"
            >
                Ver {title}
            </Button>
        </div>
    );
};

export default InfoCard;
