import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import { Property } from "../types/property";
import {
  ChevronsUpDown,
  MoreHorizontal,
  Trash2,
  MoveUpRight,
} from "lucide-react";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Route } from "@/shared/constants/route";

export const getPropertyColumns = (
  onDeleteClick: (id: string) => void
): ColumnDef<Property>[] => [
  {
    id: "direccion",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 font-medium text-neutral-600"
      >
        Dirección
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row) =>
      `${row.street} ${row.number}, ${row.locality}, ${row.province}, ${row.country}`,
    cell: ({ getValue }) => (
      <div className="truncate">{getValue() as string}</div>
    ),
    size: 407,
    minSize: 407,
    maxSize: 407,
  },
  {
    id: "propietario",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 font-medium text-neutral-600"
      >
        Propietario
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ getValue }) => (
      <div className="truncate">{getValue() as string}</div>
    ),
    size: 203,
    minSize: 203,
    maxSize: 203,
  },
  {
    id: "tipoInmueble",
    accessorKey: "typeOfProperty",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 font-medium text-neutral-600"
      >
        Tipo de inmueble
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {row
          .getValue("tipoInmueble")
          .toLowerCase()
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </div>
    ),
    size: 179,
    minSize: 179,
    maxSize: 179,
  },
  {
    id: "disponibilidad",
    accessorKey: "propertyStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 font-medium text-neutral-600"
      >
        Estado
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const estado = row.getValue("disponibilidad") as string;
      const estadoLabel =
        estado === "DISPONIBLE"
          ? "Disponible"
          : estado === "OCUPADO"
          ? "Ocupado"
          : estado;
      return (
        <span
          className={clsx(
            "px-4 py-0.5 rounded-full text-sm font-raleway border inline-block text-center min-w-[98px]",
            {
              "text-green-700 bg-green-100 border-green-400":
                estado === "DISPONIBLE",
              "text-neutral-700 bg-neutral-50 border-neutral-700":
                estado === "OCUPADO",
            }
          )}
        >
          {estadoLabel}
        </span>
      );
    },
    size: 118,
    minSize: 118,
    maxSize: 118,
  },
  {
    id: "observaciones",
    accessorKey: "observations",
    header:() => (
      <span className="flex items-center gap-1 font-medium text-neutral-600">
        Observaciones
      </span>
    ),
    cell: ({ row }) => (
      <div className="max-w-sm truncate text-sm">
        {row.getValue("observaciones") || "-"}
      </div>
    ),
    size: 261,
    minSize: 261,
    maxSize: 261,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link
                className="!text-black"
                to={Route.EditProperty}
                state={{ property: row.original }}
              >
                <MoveUpRight className="text-black inline" /> Acceder
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => onDeleteClick(row.original.id_property.toString())}
            >
              <Trash2 className="text-black mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
  },
];
