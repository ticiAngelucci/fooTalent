import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { API_URL } from "@/shared/constants/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { UserPlus, MoreVertical } from "lucide-react";  
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/shared/components/ui/dropdown-menu";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Route } from "@/shared/constants/route";
import axios from "axios";

interface Contacto {
    id: number;
    name: string;
    lastName: string;
    dni: string;
    phone: string;
    email: string;
    street: string;
    address: Address;
    number: number;
    province: string;
}
interface Address {
    street: string;
    locality: string;
    province: string;
    number: string;
    postalCode: string;
}

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
    const handleDelete = async (id: number,tipo: string) => {
        setLoading(true);
        setError('');
        const token = sessionStorage.getItem('token');  

        try {
            
            const response = await axios.delete(
               `${API_URL}${tipo === "inquilinos" ? "/tenants" : "/owner"}/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("response",response.data)
            setContactos(contactos.filter(contacto => contacto.id !== id));
        } catch (err) {
            setError('Error al eliminar el contacto.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const fetchContactos = async (tipo: string) => {
        setLoading(true);
        setError(null);
        const token = sessionStorage.getItem('token');
        try {
            const response = await axios.get(
                `${API_URL}${tipo === "inquilinos" ? "/tenants" : "/owner"}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setContactos(response.data.content || []);
        } catch (err) {
            setError("Error al cargar contactos.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContactos(tab);
    }, [tab]);

    const indexOfLastContact = currentPage * contactosPerPage;
    const indexOfFirstContact = indexOfLastContact - contactosPerPage;
    const currentContactos = contactos.slice(indexOfFirstContact, indexOfLastContact);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <DashboardLayout title="Contactos"
            redirect={Route.Dashboard}
            dashBtn={<Button
                className="bg-[#1E40AF]"
                onClick={handleRedirect}
            >
                <UserPlus className="mr-2 w-4 h-4" />
                {tab === "inquilinos" ? "Agregar inquilino" : "Agregar propietario"}
            </Button>}>
            <Tabs value={tab} onValueChange={setTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="inquilinos">Inquilinos</TabsTrigger>
                    <TabsTrigger value="propietarios">Propietarios</TabsTrigger>
                </TabsList>
                <TabsContent value={tab}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Apellido</TableHead>
                                <TableHead>DNI</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Dirección</TableHead>
                                <TableHead>Provincia</TableHead>
                                <TableHead></TableHead> 
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
                                        Cargando...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-red-500 py-4">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : currentContactos.length > 0 ? (
                                currentContactos.map((contacto, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="p-8">{contacto.name}</TableCell>
                                        <TableCell className="p-8">{contacto.lastName}</TableCell>
                                        <TableCell className="p-8">{contacto.dni}</TableCell>
                                        <TableCell className="p-8">{contacto.phone}</TableCell>
                                        <TableCell className="p-8">{contacto.email}</TableCell>
                                        <TableCell className="p-8">
                                            {contacto.address ? `${contacto.address.street}, ${contacto.address.number}` : 'No disponible'}
                                        </TableCell>
                                        <TableCell className="p-8">
                                            {contacto.address ? contacto.address.province : 'No disponible'}
                                        </TableCell>
                                        <TableCell className="p-8">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleEdit(contacto)}>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(contacto.id)}>Eliminar</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-red-500 py-4">
                                        Datos no válidos.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex justify-center mt-4">
                        <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            Anterior
                        </Button>
                        <span className="mx-2">Página {currentPage}</span>
                        <Button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastContact >= contactos.length}>
                            Siguiente
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
}
