import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { API_URL } from "@/shared/constants/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import {
  UserPlus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpRight,
  DollarSign,
  Trash2,
  Loader2,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/shared/components/ui/dropdown-menu";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Route } from "@/shared/constants/route";
import axios from "axios";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";
import { toast } from "sonner";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";

interface ContactoInquilino {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  street: string;
  number: string;
  province: string;
  locality: string;
}

interface Address {
  street: string;
  locality: string;
  province: string;
  number: string;
  postalCode: string;
}

interface ContactoPropietario {
  idOwner: number;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
  address: Address;
}

type Contacto = ContactoInquilino | ContactoPropietario;

export default function ContactosView() {
  const [tab, setTab] = useState("propietarios");
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactosPerPage] = useState(5);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState<{
    id: number;
    tipo: string;
  } | null>(null);
  const [sortField, setSortField] = useState<
    "firstName" | "lastName" | "address" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const openDeleteModal = (id: number, tipo: string) => {
    setContactoSeleccionado({ id, tipo });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!contactoSeleccionado) return;
    await handleDelete(contactoSeleccionado.id, contactoSeleccionado.tipo);
    setDeleteModalOpen(false);
    setContactoSeleccionado(null);
  };

  const handleRedirect = () => {
    if (tab === "inquilinos") {
      navigate(Route.AddTenant);
    } else {
      navigate(Route.AddOwner);
    }
  };

  const handleDelete = async (id: number, tipo: string) => {
    setLoading(true);
    setError("");
    const token = sessionStorage.getItem("token");
    console.log("id", id);
    try {
      await axios.delete(
        `${API_URL}${
          tipo === "inquilinos" ? `/tenants/${id}` : `/owner/delete/${id}`
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (tipo === "inquilinos") {
        setContactos(
          contactos.filter((c) => (c as ContactoInquilino).id !== id)
        );
      } else {
        setContactos(
          contactos.filter((c) => (c as ContactoPropietario).idOwner !== id)
        );
      }
      toast.custom(
                () => (
                    <SuccessToast
                        title="¡Contacto eliminado con éxito!"
                        description="El contacto ha sido eliminado de la tabla."
                    />
                ),
                {
                    duration: 5000,
                }
            );


    } catch (err) {
      console.error(err);
      toast.custom(
                () => (
                    <ErrorToast
                        title="¡Ocurrió un error!"
                        description="No se pudo eliminar el contacto. Por favor, inténtalo de nuevo más tarde."
                    />
                ),
                {
                    duration: 5000,
                }
            );
    } finally {
      setLoading(false);
    }
  };

  const fetchContactos = async (tipo: string) => {
    setLoading(true);
    setError(null);
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.get(
        `${API_URL}${tipo === "inquilinos" ? "/tenants" : "/owner"}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      setContactos(tipo === "inquilinos" ? data.dto || [] : data.content || []);
    } catch (err) {
      setError("Error al cargar contactos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(tab === "inquilinos" ? `/tenant/edit/${id}` : `/owner/edit/${id}`);
  };

  const handleRegisterPayment = () => {
    navigate("/payments/new");
  };

  const sortedContactos = [...contactos].sort((a, b) => {
    if (!sortField) return 0;

    const getValue = (c: Contacto) => {
      if (sortField === "address") {
        return "address" in c
          ? c.address?.street ?? ""
          : (c as ContactoInquilino).street;
      } else {
        return (c as any)[sortField] ?? "";
      }
    };

    const valueA = getValue(a).toLowerCase();
    const valueB = getValue(b).toLowerCase();

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    fetchContactos(tab);
  }, [tab]);

  const indexOfLastContact = currentPage * contactosPerPage;
  const indexOfFirstContact = indexOfLastContact - contactosPerPage;
  const currentContactos = sortedContactos.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  const totalPages = Math.ceil(contactos.length / contactosPerPage);

  function getPageNumbers(current: number, total: number) {
    const range = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) range.push(i);
    } else {
      if (current <= 3) {
        range.push(1, 2, 3, 4, "...", total);
      } else if (current >= total - 2) {
        range.push(1, "...", total - 3, total - 2, total - 1, total);
      } else {
        range.push(1, "...", current - 1, current, current + 1, "...", total);
      }
    }

    return range;
  }

  return (
    <DashboardLayout
      subtitle="Contactos"
      redirect={Route.Dashboard}
      dashBtn={
        <Button className="bg-[#1E40AF]" onClick={handleRedirect}>
          <UserPlus className="mr-2 w-4 h-4" />
          {tab === "inquilinos" ? "Agregar inquilino" : "Agregar propietario"}
        </Button>
      }
    >
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value)}
        className="w-full bg-white p-4 rounded-lg border border-neutral-200 shadow-md gap-4"
      >
        <TabsList className="mb-4 bg-neutral-100 w-[408px] h-12 ">
          <TabsTrigger
            value="propietarios"
            className="data-[state=active]:!bg-white !text-neutral-600 data-[state=active]:font-semibold data-[state=active]:!text-neutral-950 text-base"
          >
            Propietarios
          </TabsTrigger>
          <TabsTrigger
            value="inquilinos"
            className="data-[state=active]:!bg-white !text-neutral-600 data-[state=active]:font-semibold data-[state=active]:!text-neutral-950 text-base"
          >
            Inquilinos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inquilinos">
          <TablaContactos
            tipo="inquilinos"
            contactos={currentContactos}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onRegisterPayment={handleRegisterPayment}
            onRequestDelete={openDeleteModal}
            onSortChange={(field) => {
              if (sortField === field) {
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
              } else {
                setSortField(field);
                setSortDirection("asc");
              }
            }}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </TabsContent>

        <TabsContent value="propietarios">
          <TablaContactos
            tipo="propietarios"
            contactos={currentContactos}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onRegisterPayment={handleRegisterPayment}
            onRequestDelete={openDeleteModal}
            onSortChange={(field) => {
              if (sortField === field) {
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
              } else {
                setSortField(field);
                setSortDirection("asc");
              }
            }}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </TabsContent>
      </Tabs>
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="text-neutral-950 text-base font-semibold"
        >
          <ChevronLeft className="!w-6 !h-6 mr-1" />
          Anterior
        </Button>

        {getPageNumbers(currentPage, totalPages).map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-2 text-neutral-400 select-none">
              ...
            </span>
          ) : (
            <Button
              key={idx}
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              className={
                currentPage === page
                  ? "bg-blue-700 text-white text-base font-semibold"
                  : "text-base font-semibold text-neutral-950"
              }
              onClick={() =>
                typeof page === "number" ? setCurrentPage(page) : null
              }
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) =>
              currentPage < totalPages ? prev + 1 : prev
            )
          }
          className="text-neutral-950 text-base font-semibold"
        >
          Siguiente
          <ChevronRight className="!w-6 !h-6 ml-1" />
        </Button>
      </div>
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl h-52 w-[573px]">
            <h2 className="text-lg font-semibold mb-2">
              Eliminar{" "}
              {contactoSeleccionado?.tipo === "inquilinos"
                ? "inquilino"
                : "propietario"}
            </h2>
            <p className="text-sm text-neutral-600 mb-10">
              ¿Estás seguro de que deseas eliminar el{" "}
              {contactoSeleccionado?.tipo === "inquilinos"
                ? "inquilino"
                : "propietario"}
              ? Esta acción no es recuperable.
            </p>
            <div className="w-full flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
                className="w-1/2 text-base font-semibold rounded-sm !bg-white"
              >
                Cancelar
              </Button>
              <Button
                className="bg-error-600 hover:bg-error-700 w-1/2 text-base font-semibold rounded-sm"
                onClick={confirmDelete}
              >
                <X className="!w-6 !h-6" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function TablaContactos({
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
}: {
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
}) {
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

            <TableHead className="px-4 text-neutral-600">Provincia</TableHead>
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
                      }`
                    : (contacto as ContactoPropietario).address
                    ? `${(contacto as ContactoPropietario).address.street}, ${
                        (contacto as ContactoPropietario).address.number
                      }`
                    : "No disponible"}
                </TableCell>
                <TableCell>
                  {tipo === "inquilinos"
                    ? (contacto as ContactoInquilino).province
                    : (contacto as ContactoPropietario).address
                    ? (contacto as ContactoPropietario).address.province
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
                          onRegisterPayment(
                            tipo === "inquilinos"
                              ? (contacto as ContactoInquilino).id
                              : (contacto as ContactoPropietario).idOwner
                          )
                        }
                      >
                        <DollarSign className="!w-5 !h-5 text-neutral-950" />
                        Registrar Pago
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
