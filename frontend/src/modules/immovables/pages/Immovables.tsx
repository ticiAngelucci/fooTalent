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
  import { Filter, Home } from "lucide-react";
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
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-primary">Inmuebles</h1>
  
        <Tabs defaultValue="inmuebles" className="space-y-4">
          <TabsList className="border-b border-border space-x-4">
            <TabsTrigger
              value="inmuebles"
              className="text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-2 text-sm font-medium"
            >
              Inmuebles
            </TabsTrigger>
          </TabsList>
  
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/40 p-4 rounded-md shadow-sm">
            <Input placeholder="Buscar..." className="w-full sm:w-64" />
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="w-5 h-5" />
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Home className="mr-2 w-4 h-4" />
                Agregar inmueble
              </Button>
            </div>
          </div>
  
          <TabsContent value="inmuebles">
            <div className="rounded-md border mt-4 overflow-x-auto bg-white shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo de inmueble</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Observaciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inmuebles.map((item, index) => (
                    <TableRow key={index}>
                        
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell>{item.ubicacion}</TableCell>
                      <TableCell>{item.propietario}</TableCell>
                      <TableCell>
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
                      <TableCell className="max-w-sm whitespace-pre-wrap text-sm text-muted-foreground">
                        {item.observaciones || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  