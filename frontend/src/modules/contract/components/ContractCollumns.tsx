import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import {
  ArrowUpRight,
  ChevronsUpDown,
  CircleX,
  MoreHorizontal,  
  Trash2,
} from "lucide-react";
import { Contract } from "../types/contract";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Route } from "@/shared/constants/route";

interface ContractProps {
  handleDelete: (id: number) => void;
  handleCancel: (id: number) => void;
}

export const getContractColumns = ({ handleDelete, handleCancel }: ContractProps): ColumnDef<Contract>[] => [
  {
    accessorKey: "propertyAddress",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-raleway font-semibold"
        style={{ color: "#4B5563" }}

      >
        Dirección
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="truncate max-w-[300px]">{getValue() as string}</div>
    ),
    size: 300,
    minSize: 300,
    maxSize: 300,
  },
  {
    accessorKey: "tenantFullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-raleway font-semibold"
        style={{ color: "#4B5563" }}
      >
        Inquilino
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="truncate max-w-[200px]">{getValue() as string}</div>
    ),
    size: 200,
    minSize: 200,
    maxSize: 200,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-raleway font-semibold"
        style={{ color: "#4B5563" }}
      >
        Fecha de inicio
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
    size: 120,
    minSize: 120,
    maxSize: 120,
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-raleway font-semibold"
        style={{ color: "#4B5563" }}
      >
        Fecha de fin
        <ChevronsUpDown className=" h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
    size: 120,
    minSize: 120,
    maxSize: 120,
  },
  {
    id: "estado",
    header: () => (
      <span
        className="font-raleway font-semibold"
        style={{ color: "#4B5563" }}
      >
        Estado
      </span>
    ),
    accessorFn: (row) => (row.active ? "Activo" : "Finalizado"),
    cell: ({ getValue }) => {
      const estado = getValue() as string;
      return (
        <span
          className={clsx(
            "py-0.5 rounded-full text-sm font-raleway border inline-block text-center min-w-[98px]",
            {
              "text-green-600 bg-green-50 border-green-600": estado === "Activo",
              "text-gray-500 bg-gray-50 border-gray-600": estado === "Finalizado",
            }
          )}
        >
          {estado}
        </span>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    id: "valor",
    header: () => (
      <span
        className="font-raleway font-semibold"
        style={{ color: "#4B5563" }}
      >
        Valor
      </span>
    ),
    accessorFn: (row) =>
      typeof row.deposit === "number"
        ? row.deposit.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })
        : "No definido",
    cell: ({ getValue }) => (
      <span className="font-raleway text-sm">
        {getValue() as string}
      </span>
    ),
    size: 120,
    minSize: 120,
    maxSize: 120,
  },
  {
    accessorKey: "adjustmentFrequency",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold"
      >
        Ajuste
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
    size: 130,
    minSize: 130,
    maxSize: 130,
  },
  {
    accessorKey: "adjustmentType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold"
      >
        Índice
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
    size: 100,
    minSize: 100,
    maxSize: 100,
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
            <DropdownMenuItem>
              <Link
                className="!text-neutral-950"
                to={Route.EditContract}
                state={{ contract: row.original }}
              >
                <ArrowUpRight className="!text-neutral-950 inline !h-5 !w-5" /> Acceder
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleCancel(Number(row.original.id))} >
              <CircleX className="text-neutral-950 !h-5 !w-5" /> Finalizar
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleDelete(Number(row.original.id))} >
              <Trash2 className="text-neutral-950 !h-5 !w-5" /> Eliminar
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
