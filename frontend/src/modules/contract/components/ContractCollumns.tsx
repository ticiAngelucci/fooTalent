import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import {
  ChevronsUpDown,
  MoreHorizontal,
  MoveUpRight,
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
import { deleteContract } from "../services/deleteContract";
import { useContractStore } from "../store/contractStore";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";
import { toast } from "sonner";

export const getContractColumns = (): ColumnDef<Contract>[] => [
  {
    accessorKey: "propertyAddress",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold"
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
        className="font-semibold"
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
        className="font-semibold"
      >
        Fecha de inicio
        <ChevronsUpDown className="ml-2 h-4 w-4" />
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
        className="font-semibold"
      >
        Fecha de fin
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
    size: 120,
    minSize: 120,
    maxSize: 120,
  },
  {
    id: "estado",
    header: "Estado",
    accessorFn: (row) => (row.active ? "Activo" : "Finalizado"),
    cell: ({ getValue }) => {
      const estado = getValue() as string;
      return (
        <span
          className={clsx(
            "px-3 py-1 rounded-full text-xs font-semibold border",
            {
              "text-green-700 bg-green-100 border-green-400":
                estado === "Activo",
              "text-gray-700 bg-gray-200 border-gray-400":
                estado === "Finalizado",
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
    header: "Valor",
    accessorFn: (row) =>
      typeof row.deposit === "number"
        ? row.deposit.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })
        : "No definido",
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
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
                className="text-neutral-950"
                to={Route.EditContract}
                state={{ contract: row.original }}
              >
                <MoveUpRight className="text-neutral-950 inline" /> Acceder
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const confirmDelete = window.confirm(
                  "¿Estás seguro que querés eliminar este contrato?"
                );
                if (confirmDelete) {
                  deleteContract(row.original.id!)
                    .then(() => {
                      toast.custom(() => <SuccessToast title="¡Contrato eliminado!" description="El contrato se eliminó de la tabla" />);
                      useContractStore.getState().fetchContracts(); 
                    })
                    .catch((err) => {
                      if(err.response?.data?.details?.[0]?.includes("foreign key constraint fails")){
                        toast.custom(() => <ErrorToast title="¡Ocurrió un error!" description="El contrato no se puede eliminar porque tiene pagos asociados." />);
                      }else {
                        toast.custom(() => <ErrorToast title="¡Ocurrió un error!" description="El contrato no se pudo eliminar, intenta nuevamente." />)
                        
                      }
                    });
                }
              }}
            >
              <Trash2 className="text-neutral-950" /> Eliminar
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
