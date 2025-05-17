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
import { UserPlus, MoreVertical } from "lucide-react";
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

// {
//       "id": 3,
//       "firstName": "Pedro",
//       "lastName": "perez",
//       "email": "lucas@gmail.com.co",
//       "phone": "2615446912",
//       "dni": "23123456",
//       "warranty": "GARANTE PROPIETARIO",
//       "country": "Argentina",
//       "province": "Cordoba",
//       "locality": "La escondida",
//       "street": "El bolson",
//       "number": "123",
//       "postalCode": "5500",
//       "documents": [
//         {
//           "id": "7704e193-e406-467d-bcb5-5f40d3a5e84b",
//           "url": "https://res.cloudinary.com/rentary/image/upload/v1747447432/rentary/tenants/images/banneralma_id3_23123456_ab29b483.jpg.jpg",
//           "publicId": "rentary/tenants/images/banneralma_id3_23123456_ab29b483.jpg",
//           "originalName": "banneralma3.jpg",
//           "fileType": "image",
//           "extension": "jpg"
//         }
//       ]
//     }

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
    const [tab, setTab] = useState("inquilinos");
    const [contactos, setContactos] = useState<Contacto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [contactosPerPage] = useState(5);
    const navigate = useNavigate();

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
        console.log("id",id)
        try {
            await axios.delete(
                `${API_URL}${tipo === "inquilinos"
                    ? `/tenants/${id}` 
                    : `/owner/delete/${id}`
                }`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (tipo === "inquilinos") {
                setContactos(contactos.filter((c) => (c as ContactoInquilino).id !== id));
            } else {
                setContactos(contactos.filter((c) => (c as ContactoPropietario).idOwner !== id));
            }
        } catch (err) {
            setError("Error al eliminar el contacto.");
            console.error(err);
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

    useEffect(() => {
        fetchContactos(tab);
    }, [tab]);

    const indexOfLastContact = currentPage * contactosPerPage;
    const indexOfFirstContact = indexOfLastContact - contactosPerPage;
    const currentContactos = contactos.slice(indexOfFirstContact, indexOfLastContact);

    return (
        <DashboardLayout
            title="Contactos"
            redirect={Route.Dashboard}
            dashBtn={
                <Button className="bg-[#1E40AF]" onClick={handleRedirect}>
                    <UserPlus className="mr-2 w-4 h-4" />
                    {tab === "inquilinos" ? "Agregar inquilino" : "Agregar propietario"}
                </Button>
            }
        >
            <Tabs value={tab} onValueChange={(value) => setTab(value)} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="inquilinos">Inquilinos</TabsTrigger>
                    <TabsTrigger value="propietarios">Propietarios</TabsTrigger>
                </TabsList>

                <TabsContent value="inquilinos">
                    <TablaContactos
                        tipo="inquilinos"
                        contactos={currentContactos}
                        loading={loading}
                        error={error}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </TabsContent>

                <TabsContent value="propietarios">
                    <TablaContactos
                        tipo="propietarios"
                        contactos={currentContactos}
                        loading={loading}
                        error={error}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </TabsContent>
            </Tabs>
            <div className="flex justify-between items-center mt-4">
                <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    Anterior
                </Button>

                <span className="text-sm text-gray-700">Página {currentPage}</span>

                <Button
                    variant="outline"
                    disabled={indexOfLastContact >= contactos.length}
                    onClick={() =>
                        setCurrentPage((prev) =>
                            indexOfLastContact < contactos.length ? prev + 1 : prev
                        )
                    }
                >
                    Siguiente
                </Button>
            </div>
        </DashboardLayout>
    );
}

function TablaContactos({
    tipo,
    contactos,
    loading,
    error,
    onEdit,
    onDelete,
}: {
    tipo: string;
    contactos: Contacto[];
    loading: boolean;
    error: string | null;
    onEdit: (id: number) => void;
    onDelete: (id: number, tipo: string) => void;
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Correo electrónico</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Provincia</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                            Cargando...
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
                        <TableRow key={index}>
                            <TableCell className="p-8">{contacto.firstName}</TableCell>
                            <TableCell className="p-8">{contacto.lastName}</TableCell>
                            <TableCell className="p-8">{contacto.dni}</TableCell>
                            <TableCell className="p-8">{contacto.phone}</TableCell>
                            <TableCell className="p-8">{contacto.email}</TableCell>
                            <TableCell className="p-8">
                                {tipo === "inquilinos"
                                    ? `${(contacto as ContactoInquilino).street}, ${(contacto as ContactoInquilino).number}`
                                    : (contacto as ContactoPropietario).address
                                        ? `${(contacto as ContactoPropietario).address.street}, ${(contacto as ContactoPropietario).address.number}`
                                        : "No disponible"}
                            </TableCell>
                            <TableCell className="p-8">
                                {tipo === "inquilinos"
                                    ? (contacto as ContactoInquilino).province
                                    : (contacto as ContactoPropietario).address
                                        ? (contacto as ContactoPropietario).address.province
                                        : "No disponible"}
                            </TableCell>
                            <TableCell className="p-8">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                onEdit(tipo === "inquilinos"
                                                    ? (contacto as ContactoInquilino).id
                                                    : (contacto as ContactoPropietario).idOwner)
                                            }
                                        >
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                onDelete(
                                                    tipo === "inquilinos"
                                                        ? (contacto as ContactoInquilino).id
                                                        : (contacto as ContactoPropietario).idOwner,
                                                    tipo
                                                )
                                            }
                                        >
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
    );
}
