import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Filter, UserPlus } from "lucide-react";

interface Contacto {
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    email: string;
    direccion: string;
    provincia: string;
}

const contactos: Contacto[] = [
    {
        nombre: "Juan José",
        apellido: "Gómez",
        dni: "99199999",
        telefono: "11 99 999 999",
        email: "JJGomez@dominio.com",
        direccion: "Av.Renta 1122",
        provincia: "Buenos Aires",
    },
    {
        nombre: "Ana",
        apellido: "Garcia",
        dni: "99199998",
        telefono: "11 99 999 999",
        email: "AGarcia@dominio.com",
        direccion: "Av.Venta 1122",
        provincia: "Mendoza",
    },
    {
        nombre: "Elizabeth",
        apellido: "Perez",
        dni: "99199997",
        telefono: "11 99 999 999",
        email: "EPerez@dominio.com",
        direccion: "Av.Rentar 1122",
        provincia: "Buenos Aires",
    },
];

export default function ContactosView() {
    const [tab, setTab] = useState("inquilinos");

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-3xl font-bold">Contactos</h1>

            <Tabs
                value={tab}
                onValueChange={setTab}
                className="space-y-4"
            >
                <div className="flex flex-wrap justify-between items-center gap-2">
                    <TabsList className="flex gap-2 border-b border-border">
                        <TabsTrigger
                            value="propietarios"
                            className="rounded-t-md px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary transition-all"
                        >
                            Propietarios
                        </TabsTrigger>
                        <TabsTrigger
                            value="inquilinos"
                            className="rounded-t-md px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary transition-all"
                        >
                            Inquilinos
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                        <Input placeholder="Buscar..." className="w-full max-w-sm" />
                        <Button variant="outline" size="icon">
                            <Filter className="w-5 h-5" />
                        </Button>
                        <Button>
                            <UserPlus className="mr-2 w-4 h-4" />
                            {tab === "inquilinos" ? "Agregar inquilino" : "Agregar propietario"}
                        </Button>
                    </div>
                </div>

                <TabsContent value="inquilinos">
                    <div className="rounded-md border mt-4 overflow-x-auto">
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contactos.map((contacto, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{contacto.nombre}</TableCell>
                                        <TableCell>{contacto.apellido}</TableCell>
                                        <TableCell>{contacto.dni}</TableCell>
                                        <TableCell>{contacto.telefono}</TableCell>
                                        <TableCell>{contacto.email}</TableCell>
                                        <TableCell>{contacto.direccion}</TableCell>
                                        <TableCell>{contacto.provincia}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="propietarios">
                    <div className="text-muted-foreground p-4">
                        Sin datos de propietarios aún.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
