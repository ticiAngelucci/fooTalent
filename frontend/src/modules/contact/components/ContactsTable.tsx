import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/shared/components/ui/dropdown-menu";
import {
  ArrowUpRight,
  DollarSign,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { Contacto, ContactoInquilino, ContactoPropietario } from "../types/types";

interface Props {
  tipo: string;
  contactos: Contacto[];
  loading: boolean;
  error: string | null;
  onEdit: (id: number) => void;
  onRegisterPayment: (id: number) => void;
  onRequestDelete: (id: number, tipo: string) => void;
  onSortChange: (field: "firstName" | "lastName" | "address") => void;
  sortField: string | null;
  sortDirection: "asc" | "desc";
}

export default function ContactsTable({
  tipo,
  contactos,
  loading,
  error,
  onEdit,
  onRegisterPayment,
  onRequestDelete,
  onSortChange,
  sortField,
  sortDirection,
}: Props) {
  return (
    <div className="rounded-md border mt-4 overflow-x-auto bg-white">
      <Table>
              <TableHeader className="bg-neutral-100">
                <TableRow>
                  <TableHead
                    onClick={() => onSortChange("firstName")}
                    className="px-4 text-neutral-600 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      Nombre
                      {sortField === "firstName" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    onClick={() => onSortChange("lastName")}
                    className="px-4 text-neutral-600 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      Apellido
                      {sortField === "lastName" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
      
                  <TableHead className="px-4 text-neutral-600">DNI</TableHead>
                  <TableHead className="px-4 text-neutral-600">Teléfono</TableHead>
                  <TableHead className="px-4 text-neutral-600">
                    Correo electrónico
                  </TableHead>
                  <TableHead
                    onClick={() => onSortChange("address")}
                    className="px-4 text-neutral-600 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      Dirección
                      {sortField === "address" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
      
                  <TableHead className="px-4 text-neutral-600"></TableHead>
                </TableRow>
              </TableHeader>
      
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-800" />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-red-500 py-4">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : contactos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No hay contactos disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  contactos.map((contacto, index) => (
                    <TableRow
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-neutral-100"
                      } h-10 w-44 text-base text-zinc-950`}
                    >
                      <TableCell className="px-4">{contacto.firstName}</TableCell>
                      <TableCell className="px-4">{contacto.lastName}</TableCell>
                      <TableCell className="px-4">{contacto.dni}</TableCell>
                      <TableCell className="px-4">{contacto.phone}</TableCell>
                      <TableCell className="px-4">{contacto.email}</TableCell>
                      <TableCell className="px-4">
                        {tipo === "inquilinos"
                          ? `${(contacto as ContactoInquilino).street}, ${
                              (contacto as ContactoInquilino).number
                            },${(contacto as ContactoInquilino).province}`
                          : (contacto as ContactoPropietario).address
                          ? `${(contacto as ContactoPropietario).address.street}, ${
                              (contacto as ContactoPropietario).address.number
                            }, ${(contacto as ContactoPropietario).address.province}`
                          : "No disponible"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreHorizontal className="text-neutral-950" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                onEdit(
                                  tipo === "inquilinos"
                                    ? (contacto as ContactoInquilino).id
                                    : (contacto as ContactoPropietario).idOwner
                                )
                              }
                            >
                              <ArrowUpRight className="!w-5 !h-5 text-neutral-950" />
                              Acceder
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onRequestDelete(
                                  tipo === "inquilinos"
                                    ? (contacto as ContactoInquilino).id
                                    : (contacto as ContactoPropietario).idOwner,
                                  tipo
                                )
                              }
                            >
                              <Trash2 className="!w-5 !h-5 text-neutral-950" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
    </div>
  );
}
