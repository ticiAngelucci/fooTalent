import { InfoCardProps } from "@/modules/dashboard/types/infoCard";
import {
  Check,
  CircleAlert,
  ClipboardPenLine,
  ContactRound,
  House,
} from "lucide-react";
import { Link } from "react-router-dom";

const InfoCard = ({
  title,
  subtitle,
  type,
  items,
  redirect,
}: InfoCardProps) => {
  return (
    <div className="bg-neutral-50 flex flex-col justify-between rounded-2xl gap-2.5 shadow-md p-6 space-y-4 border border-zinc-200 h-full">
      <div className="flex flex-col gap-0.5">
        <h4 className="text-2xl font-semibold text-neutral-950">{title}</h4>
        <span className="text-sm font-normal text-zinc-500">{subtitle}</span>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {items.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-start gap-4 h-[170px] bg-white rounded-lg shadow-none border border-neutral-200 pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex w-full text-sm gap-4 p-6 rounded-[8px] text-gray-800 font-medium space-y-1">
                {type === "contact" && (
                  <>
                    <ContactRound className="size-10 text-brand-800" />
                    <div className="flex flex-col w-full h-full gap-2 truncate">
                      <p>
                        Nombre:{" "}
                        <span className="text-black font-semibold">
                          {item.firstName}
                        </span>
                      </p>
                      <p>
                        Apellido:{" "}
                        <span className="text-black font-semibold">
                          {item.lastName}
                        </span>
                      </p>
                      <p>
                        Teléfono:{" "}
                        <span className="text-black font-semibold">
                          {item.phone}
                        </span>
                      </p>
                      <p>
                        Ubicación:{" "}
                        <span className="text-black font-semibold">
                          {item.province}
                        </span>
                      </p>
                    </div>
                  </>
                )}
                {type === "contract" && (
                  <>
                    <ClipboardPenLine className="size-10 text-brand-800" />
                    <div className="flex flex-col w-full h-full gap-2 truncate">
                      <p>
                        Tipo Inmueble:{" "}
                        <span className="text-black font-semibold">Casa</span>
                      </p>
                      <p className=" truncate">
                        Ubicación:{" "}
                        <span className="text-black font-semibold">
                          {item.propertyAddress}
                        </span>
                      </p>
                      <p>
                        Inquilino:{" "}
                        <span className="text-black font-semibold">
                          {item.ownerFullName}
                        </span>
                      </p>
                      {item.active ? (
                        <span className="flex gap-2.5  items-center mt-1 text-success-700 bg-green-50 border border-success-700 px-2 py-1 rounded-full w-fit text-sm">
                          <Check className="size-5" />
                          Vigente
                        </span>
                      ) : (
                        <span className="flex gap-2.5  items-center mt-1 text-xs text-error-700 bg-error-50 border border-error-700 px-2 py-1 rounded-full w-fit">
                          <CircleAlert className="size-5" />
                          No vigente
                        </span>
                      )}
                    </div>
                  </>
                )}
                {type === "property" && (
                  <>
                    <House className="size-10 text-brand-800" />
                    <div className="flex flex-col w-full h-full gap-2 truncate">
                      <p>
                        Tipo de inmueble:{" "}
                        <span className="text-black font-semibold">
                          {item.typeOfProperty
                            .toLowerCase()
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </span>
                      </p>
                      <p className="truncate">
                        Ubicación:{" "}
                        <span className="text-black font-semibold">
                          {`${item.street}, ${item.locality}, ${item.province}`}
                        </span>
                      </p>
                      <p>
                        Propietario:{" "}
                        <span className="text-black font-semibold">
                          Juan Perez
                        </span>
                      </p>
                      {item.propertyStatus &&
                      item.propertyStatus == "DISPONIBLE" ? (
                        <span className="flex gap-2.5  items-center mt-1 text-xs text-success-700 bg-green-50 border border-success-700 px-2 py-1 rounded-full w-fit normal-case">
                          <Check className="size-5" />
                          {item.propertyStatus === "DISPONBLE" && (
                            <>Disponible</>
                          )}
                        </span>
                      ) : (
                        <span className="flex gap-2.5  items-center mt-1 text-xs text-error-700 bg-error-50 border border-error-700 px-2 py-1 rounded-full w-fit normal-case">
                          <CircleAlert className="size-5" />
                          {item.propertyStatus === "OCUPADO" && <>Ocupado</>}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Link className="self-end" to={redirect}>
        Ver todos
      </Link>
    </div>
  );
};

export default InfoCard;
