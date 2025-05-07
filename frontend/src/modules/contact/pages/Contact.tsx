import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
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
import { Filter, UserPlus, X } from "lucide-react";

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            nombre: "",
            apellido: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            provincia: "",
        }
    });

    const onSubmit = (data: any) => {
        console.log(data);
        closeModal();
    };

    return (
            <div className="p-6 space-y-4 w-[95%] mx-auto max-w-[1700px] min-h-screen">
                <h1 className="text-3xl mb-30 mt-20">Contactos</h1>

                <Tabs value={tab} onValueChange={setTab} className="space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <TabsList className="flex gap-2 bg-[#E5E7EB] p-1 rounded-md w-[35%]">
                            <TabsTrigger
                                value="propietarios"
                                className="px-4 py-2 text-sm font-medium rounded-md transition-all 
                            bg-[#E5E7EB]
                            data-[state=active]:!bg-white 
                            data-[state=active]:text-black 
                            data-[state=inactive]:text-gray-600
                            focus:outline-none"
                            >
                                Propietarios
                            </TabsTrigger>
                            <TabsTrigger
                                value="inquilinos"
                                className="px-4 py-2 text-sm font-medium rounded-md transition-all 
                            bg-[#E5E7EB]
                            data-[state=active]:!bg-white 
                            data-[state=active]:text-black 
                            data-[state=inactive]:text-gray-600
                            focus:outline-none"
                            >
                                Inquilinos
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Buscar..."
                                className="w-[75%] text-lg py-3 px-4"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                className="text-lg py-3 px-6 bg-transparent border border-gray-300 hover:bg-gray-100 hover:border-gray-500"
                            >
                                <Filter className="w-6 h-6" />
                            </Button>

                            <Button
                                className="bg-[#1E40AF]"
                                onClick={openModal}
                            >
                                <UserPlus className="mr-2 w-4 h-4" />
                                {tab === "inquilinos" ? "Agregar inquilino" : "Agregar propietario"}
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="inquilinos">
                        <div className="rounded-md border mt-4 overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#E5E7EB]">
                                    <TableRow>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Nombre</TableHead>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Apellido</TableHead>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">DNI</TableHead>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Teléfono</TableHead>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Correo electrónico</TableHead>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Dirección</TableHead>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Provincia</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contactos.map((contacto, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="p-8">{contacto.nombre}</TableCell>
                                            <TableCell className="p-8">{contacto.apellido}</TableCell>
                                            <TableCell className="p-8">{contacto.dni}</TableCell>
                                            <TableCell className="p-8">{contacto.telefono}</TableCell>
                                            <TableCell className="p-8">{contacto.email}</TableCell>
                                            <TableCell className="p-8">{contacto.direccion}</TableCell>
                                            <TableCell className="p-8">{contacto.provincia}</TableCell>
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

                {/* Modal */}
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="bg-white p-8 rounded-md w-[500px] max-w-[90%]"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl">
                                    {tab === "inquilinos" ? "Agregar inquilino" : "Agregar propietario"}
                                </h2>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={closeModal}
                                    className="text-gray-600 hover:bg-gray-200"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <Controller
                                        name="nombre"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Nombre" className="w-full" />
                                        )}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Apellido</label>
                                    <Controller
                                        name="apellido"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Apellido" className="w-full" />
                                        )}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">DNI</label>
                                    <Controller
                                        name="dni"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="DNI" className="w-full" />
                                        )}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                    <Controller
                                        name="telefono"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Teléfono" className="w-full" />
                                        )}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Correo electrónico" className="w-full" />
                                        )}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                                    <Controller
                                        name="direccion"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Dirección" className="w-full" />
                                        )}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Provincia</label>
                                    <Controller
                                        name="provincia"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Provincia" className="w-full" />
                                        )}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-transparent border-2 border-gray-700 text-gray-700 hover:bg-red-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 px-6 py-2 rounded-md transition-all"
                                    >
                                        Cancelar
                                    </Button>

                                    <Button
                                        type="submit"
                                        className="bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 px-6 py-2 rounded-md transition-all"
                                    >
                                        Guardar
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </div>
    );
}
