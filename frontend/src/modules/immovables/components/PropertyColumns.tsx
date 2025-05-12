import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import { Property } from "../types/property";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export const getPropertyColumns = (): ColumnDef<Property>[] => [
  {
    id: "direccion",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold"
      >
        Dirección
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row) => `${row.street} ${row.number}, ${row.locality}, ${row.province}, ${row.country}`,
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
  },
  {
    id: "propietario",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold"
      >
        Propietario
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
  },
  {
    id: "tipoInmueble",
    accessorKey: "typeOfProperty",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold"
      >
        Tipo de inmueble
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("tipoInmueble")}</div>,
  },
  {
    id: "disponibilidad",
    accessorKey: "propertyStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold"
      >
        Disponibilidad
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const estado = row.getValue("disponibilidad") as string;
      return (
        <span
          className={clsx(
            "px-3 py-1 rounded-full text-xs font-semibold border",
            {
              "text-green-700 bg-green-100 border-green-400": estado === "DISPONIBLE",
              "text-black bg-gray-700 border-black": estado === "OCUPADO"
            }
          )}
        >
          {estado}
        </span>
      );
    },
  },
  {
    id: "observaciones",
    accessorKey: "observations",
    header: "Observaciones",
    cell: ({ row }) => (
      <div className="max-w-sm whitespace-pre-wrap text-sm text-muted-foreground">
        {row.getValue("observaciones") || "-"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
            <DropdownMenuItem>Editar inmueble</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];