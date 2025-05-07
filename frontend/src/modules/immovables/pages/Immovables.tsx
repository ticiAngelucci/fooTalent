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
import { Filter, Home, X } from "lucide-react";
import clsx from "clsx";

interface Inmueble {
    nombre: string;
    tipo: string;
    ubicacion: string;
    propietario: string;
    estado: "Libre" | "Ocupado" | "Reservado";
    observaciones?: string;
}

const inmuebles: Inmueble[] = [
    {
        nombre: "La Margarita",
        tipo: "Casa",
        ubicacion: "Av. Gomez 1122, Palermo, CABA",
        propietario: "Javier Ortiz",
        estado: "Libre",
        observaciones: "Cañería rota en cocina, ventana en la habitación fisurada",
    },
    {
        nombre: "Tulipanes",
        tipo: "Duplex",
        ubicacion: "Av. Gomez 1122, Palermo, CABA",
        propietario: "Ana Garcia",
        estado: "Ocupado",
        observaciones: "Cañería rota en cocina",
    },
    {
        nombre: "Alegrías",
        tipo: "Departamento",
        ubicacion: "Av. Gomez 1122, Palermo, CABA",
        propietario: "Javier Ortiz",
        estado: "Libre",
    },
    {
        nombre: "Peonías",
        tipo: "Departamento",
        ubicacion: "Av. Gomez 1122, Palermo, CABA",
        propietario: "Javier Ortiz",
        estado: "Reservado",
        observaciones: "Cañería rota en cocina",
    },
    {
        nombre: "Rosas",
        tipo: "PH",
        ubicacion: "Av. Gomez 1122, Palermo, CABA",
        propietario: "Javier Ortiz",
        estado: "Reservado",
    },
    {
        nombre: "Tulipanes",
        tipo: "Duplex",
        ubicacion: "Av. Gomez 1122, Palermo, CABA",
        propietario: "Ana Garcia",
        estado: "Ocupado",
    },
];

export default function InmueblesView() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            nombre: "",
            tipoInmueble: "",
            ubicacion: "",
            propietario: "",
            estado: "",
            observaciones: "",
        }
    });

    const onSubmit = (data: any) => {
        console.log(data);
        closeModal();
    };
    return (
            <div className="p-6 space-y-4 w-[95%] mx-auto max-w-[1700px] min-h-screen">
                <h1 className="text-3xl mb-30 mt-20">Inmuebles</h1>

                <Tabs defaultValue="inmuebles" className="space-y-4">

                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <TabsList className="flex gap-2  p-1 bg-white rounded-md w-[35%]">
                            <TabsTrigger
                                value="inmuebles"
                                className="px-4 py-2 text-sm font-medium rounded-md transition-all 
                            focus:outline-none"
                            >
                                Inmuebles
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
                                <Home className="mr-2 w-4 h-4" />
                                Agregar inmueble
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="inmuebles">
                        <div className="rounded-md border mt-4 overflow-x-auto bg-white shadow">
                            <Table>
                                <TableHeader className="bg-[#E5E7EB]">
                                    <TableRow>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Nombre</TableHead>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Tipo de inmueble</TableHead>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Ubicación</TableHead>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Propietario</TableHead>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Estado</TableHead>
                                        <TableHead className="pt-4 pb-4 pl-8 pr-8">Observaciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inmuebles.map((item, index) => (
                                        <TableRow key={index}>

                                            <TableCell className="p-8">{item.nombre}</TableCell>
                                            <TableCell className="p-8">{item.tipo}</TableCell>
                                            <TableCell className="p-8">{item.ubicacion}</TableCell>
                                            <TableCell className="p-8">{item.propietario}</TableCell>
                                            <TableCell className="p-8">
                                                <span
                                                    className={clsx(
                                                        "px-3 py-1 rounded-full text-xs font-semibold border",
                                                        {
                                                            "text-green-700 bg-green-100 border-green-400":
                                                                item.estado === "Libre",
                                                            "text-red-700 bg-red-100 border-red-400":
                                                                item.estado === "Ocupado",
                                                            "text-yellow-700 bg-yellow-100 border-yellow-400":
                                                                item.estado === "Reservado",
                                                        }
                                                    )}
                                                >
                                                    {item.estado}
                                                </span>
                                            </TableCell>
                                            <TableCell className="max-w-sm whitespace-pre-wrap text-sm text-muted-foreground p-8">
                                                {item.observaciones || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
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
                                    Agregar inmueble
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
                                    <label className="block text-sm font-medium text-gray-700">Tipo de inmueble</label>
                                    <Controller
                                        name="tipoInmueble"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Tipo de inmueble" className="w-full" />
                                        )}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Ubicacion</label>
                                    <Controller
                                        name="ubicacion"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Ubicacion" className="w-full" />
                                        )}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Propietario</label>
                                    <Controller
                                        name="propietario"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Propietario" className="w-full" />
                                        )}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <Controller
                                        name="estado"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Estado" className="w-full" />
                                        )}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <Controller
                                        name="observaciones"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Observaciones" className="w-full" />
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
