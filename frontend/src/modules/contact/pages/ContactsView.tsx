// ✅ pages/Contact.tsx
import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { Button } from "@/shared/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/shared/constants/api";
import { Route } from "@/shared/constants/route";
import axios from "axios";
import { toast } from "sonner";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";
import ContactsTable from "../components/ContactsTable";
import PaginationControls from "../components/PaginationControls";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import {
  Contacto,
  ContactoInquilino,
  ContactoPropietario,
} from "../types/types";

export default function ContactsView() {
  const [tab, setTab] = useState("propietarios");
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactosPerPage] = useState(5);
  const [sortField, setSortField] = useState<
    "firstName" | "lastName" | "address" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState<{
    id: number;
    tipo: string;
  } | null>(null);

  const navigate = useNavigate();

  const fetchContactos = async (tipo: string) => {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_URL}${tipo === "inquilinos" ? "/tenants" : "/owner"}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      setContactos(tipo === "inquilinos" ? data.dto || [] : data.content || []);
    } catch {
      setError("Error al cargar contactos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactos(tab);
  }, [tab]);

  const handleDelete = async (id: number, tipo: string) => {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(
        `${API_URL}${
          tipo === "inquilinos" ? `/tenants/${id}` : `/owner/delete/${id}`
        }`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (tipo === "inquilinos") {
        setContactos((prev) =>
          prev.filter((c) => (c as ContactoInquilino).id !== id)
        );
      } else {
        setContactos((prev) =>
          prev.filter((c) => (c as ContactoPropietario).idOwner !== id)
        );
      }
      toast.custom(
        () => (
          <SuccessToast
            title="¡Contacto eliminado con éxito!"
            description="El contacto ha sido eliminado de la tabla."
          />
        ),
        { duration: 5000 }
      );
    } catch {
      toast.custom(
        () => (
          <ErrorToast
            title="¡Ocurrió un error!"
            description="No se pudo eliminar el contacto. Intenta nuevamente."
          />
        ),
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    navigate(tab === "inquilinos" ? Route.AddTenant : Route.AddOwner);
  };
  const handleEdit = (id: number) => {
    navigate(tab === "inquilinos" ? `/tenant/edit/${id}` : `/owner/edit/${id}`);
  };
  const handleRegisterPayment = () => {
    navigate("/payments/new");
  };
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

  const sortedContactos = [...contactos].sort((a, b) => {
    if (!sortField) return 0;
    const getValue = (c: Contacto) =>
      sortField === "address"
        ? "address" in c
          ? c.address?.street ?? ""
          : (c as ContactoInquilino).street
        : (c as any)[sortField] ?? "";
    const valueA = getValue(a).toLowerCase();
    const valueB = getValue(b).toLowerCase();
    return valueA.localeCompare(valueB) * (sortDirection === "asc" ? 1 : -1);
  });

  const indexOfLast = currentPage * contactosPerPage;
  const indexOfFirst = indexOfLast - contactosPerPage;
  const currentContactos = sortedContactos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(contactos.length / contactosPerPage);

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
        onValueChange={setTab}
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
          <ContactsTable
            {...{
              tipo: "inquilinos",
              contactos: currentContactos,
              loading,
              error,
              onEdit: handleEdit,
              onRegisterPayment: handleRegisterPayment,
              onRequestDelete: openDeleteModal,
              onSortChange: (field) => {
                setSortField(field);
                setSortDirection((prev) =>
                  sortField === field && prev === "asc" ? "desc" : "asc"
                );
              },
              sortField,
              sortDirection,
            }}
          />
        </TabsContent>

        <TabsContent value="propietarios">
          <ContactsTable
            {...{
              tipo: "propietarios",
              contactos: currentContactos,
              loading,
              error,
              onEdit: handleEdit,
              onRegisterPayment: handleRegisterPayment,
              onRequestDelete: openDeleteModal,
              onSortChange: (field) => {
                setSortField(field);
                setSortDirection((prev) =>
                  sortField === field && prev === "asc" ? "desc" : "asc"
                );
              },
              sortField,
              sortDirection,
            }}
          />
        </TabsContent>
      </Tabs>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        tipo={contactoSeleccionado?.tipo || ""}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
}
