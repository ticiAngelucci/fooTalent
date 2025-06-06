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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface ContractProps {
  handleDelete: (id: number) => void;
  handleCancel: (id: number) => void;
}

export const getContractColumns = ({
  handleDelete,
  handleCancel,
}: ContractProps): ColumnDef<Contract>[] => [
  {
    accessorKey: "propertyAddress",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 font-medium text-neutral-600"
        style={{ color: "#4B5563" }}
      >
        Dirección
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="truncate max-w-[300px]">{getValue() as string}</div>
    ),
    size: 280,
    minSize: 280,
    maxSize: 280,
  },
  {
    accessorKey: "tenantFullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 font-medium text-neutral-600"
        style={{ color: "#4B5563" }}
      >
        Inquilino
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="truncate max-w-[200px]">{getValue() as string}</div>
    ),
    size: 160,
    minSize: 160,
    maxSize: 160,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 font-medium text-neutral-600"
        style={{ color: "#4B5563" }}
      >
        Fecha de inicio
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
    size: 140,
    minSize: 460,
    maxSize: 140,
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 font-medium text-neutral-600"
        style={{ color: "#4B5563" }}
      >
        Fecha de fin
        <ChevronsUpDown className=" h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
    size: 140,
    minSize: 140,
    maxSize: 140,
  },
  {
    id: "estado",
    header: () => (
      <div className="flex items-center justify-center w-full h-full">
        <span className="font-medium text-neutral-600">Estado</span>
      </div>
    ),
    accessorFn: (row) => (row.active ? "Activo" : "Finalizado"),
    cell: ({ getValue }) => {
      const estado = getValue() as string;
      return (
        <span
          className={clsx(
            "py-0.5 rounded-full text-sm font-raleway border inline-block text-center min-w-[98px]",
            {
              "text-success-700 bg-success-50 border-success-700":
                estado === "Activo",
              "text-neutral-700 bg-neutral-50 border-neutral-700":
                estado === "Finalizado",
            }
          )}
        >
          {estado}
        </span>
      );
    },
    size: 120,
    minSize: 120,
    maxSize: 120,
  },
  {
    id: "valor",
    header: () => (
      <div className="flex items-center justify-center w-full h-full">
        <span className="font-medium text-neutral-600">Valor</span>
      </div>
    ),
    accessorFn: (row) =>
      typeof row.baseRent === "number"
        ? row.baseRent.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })
        : "No definido",
    cell: ({ getValue }) => (
      <span className="font-raleway text-sm">{getValue() as string}</span>
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
        className="flex items-center gap-1 font-medium text-neutral-600"
        style={{ color: "#4B5563" }}
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
        className="flex items-center gap-1 font-medium text-neutral-600"
        style={{ color: "#4B5563" }}
      >
        Índice
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
    size: 90,
    minSize: 90,
    maxSize: 90,
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
                <ArrowUpRight className="!text-neutral-950 inline !h-5 !w-5" />{" "}
                Acceder
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleCancel(Number(row.original.id))}
              disabled={!row.original.active}
            >
              <CircleX className="text-neutral-950 !h-5 !w-5" /> Finalizar
            </DropdownMenuItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    className={`cursor-pointer ${
                      row.original.active
                        ? "opacity-50 pointer-events-auto"
                        : ""
                    }`}
                    onClick={() => {
                      if (!row.original.active) {
                        handleDelete(Number(row.original.id));
                      }
                    }}
                  >
                    <Trash2 className="text-neutral-950 !h-5 !w-5" /> Eliminar
                  </DropdownMenuItem>
                </TooltipTrigger>
                {row.original.active && (
                  <TooltipContent>
                    <p>
                      No se puede eliminar
                      <br />
                      un contrato activo
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
  },
];
