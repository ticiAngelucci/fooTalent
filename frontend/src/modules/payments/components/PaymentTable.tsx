import {
  ChevronsUpDown,
  DollarSign,
  Loader2,
  MoreHorizontal,
  MoveUpRight,
  Trash2,
} from "lucide-react";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { formatDeadline } from "../servises/paymentService";
import { Payment } from "../types/pyments";
import { Route } from "@/shared/constants/route";
import { useNavigate } from "react-router-dom";
import { getContractById } from "../service/getContractService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
  sortData: (column: keyof Payment) => void;
  handleOpen: (
    id: string,
    name: string,
    address: string,
    amount: number,
    paymentId: number
  ) => void;
  handleDelete: (id: string) => void;
}

export const PaymentTable = ({
  payments,
  loading,
  sortData,
  handleOpen,
  handleDelete,
}: PaymentTableProps) => {
  const navigate = useNavigate();
  const handleGetContract = async (contractId: number) => {
    try {
      const contract = await getContractById(contractId);
      navigate(Route.EditContract, {
        state: { contract },
      });
    } catch (error) {
      console.error("Error al obtener contrato:", error);
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-neutral-100">
          <TableHead className="w-12"></TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("tenantName")}
              className="flex items-center gap-1 font-medium text-neutral-600"
            >
              Contrato
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("propertyAddress")}
              className="flex items-center gap-1 font-medium text-neutral-600"
            >
              Dirección
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("adjustmentFrequency")}
              className="flex items-center gap-1 font-medium text-neutral-600"
            >
              Ajuste
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("amount")}
              className="flex items-center gap-1 font-medium text-neutral-600"
            >
              Índice
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("amount")}
              className="flex items-center gap-1 font-medium text-neutral-600"
            >
              Valor de alquiler
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("deadline")}
              className="flex items-center gap-1 font-medium text-neutral-600"
            >
              Fecha límite
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("status")}
              className="flex items-center gap-1 font-medium text-neutral-600"
            >
              Estado
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-800" />
            </TableCell>
          </TableRow>
        ) : payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4">
              No se encontraron pagos
            </TableCell>
          </TableRow>
        ) : (
          payments
            .filter((payment) => payment.serviceType === "ALQUILER")
            .map((payment, index) => (
              <TableRow
                key={payment.id}
                className={index % 2 === 0 ? "bg-white" : "bg-neutral-100"}
              >
                <TableCell></TableCell>
                <TableCell className="font-medium">
                  {payment.tenantName}
                </TableCell>
                <TableCell>{payment.propertyAddress}</TableCell>
                <TableCell>{payment.adjustmentFrequency}</TableCell>
                <TableCell>{payment.adjustmentType}</TableCell>
                <TableCell>$ {payment.amount.toLocaleString()}</TableCell>
                <TableCell>{formatDeadline(payment.deadline)}</TableCell>
                <TableCell>
                  <PaymentStatusBadge status={payment.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => handleGetContract(payment.contractId)}
                      >
                        <MoveUpRight className="text-neutral-950 inline" />{" "}
                        Acceder
                      </DropdownMenuItem>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <DropdownMenuItem
                              className={`hover:cursor-pointer ${
                                payment.status == "PAGADO"
                                  ? "opacity-50 pointer-events-auto"
                                  : ""
                              }`}
                              onClick={() => {
                                if (!(payment.status == "PAGADO")) {
                                  handleOpen(
                                    payment.contractId.toString(),
                                    payment.tenantName,
                                    payment.propertyAddress,
                                    payment.amount,
                                    payment.id
                                  );
                                }
                              }}
                            >
                              <DollarSign />
                              Registrar pago
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          {payment.status == "PAGADO" && (
                            <TooltipContent>
                              <p>
                                No se puede registrar
                                <br />
                                un pago ya realizado
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                        <br />
                        <Tooltip>
                          <TooltipTrigger>
                            <DropdownMenuItem
                              className={`hover:cursor-pointer ${
                                payment.status == "PAGADO"
                                  ? "opacity-50 pointer-events-auto"
                                  : ""
                              }`}
                              onClick={() => {
                                if (!(payment.status == "PAGADO")) {
                                  handleDelete(payment.id.toString());
                                }
                              }}
                            >
                              <Trash2 /> Eliminar
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          {payment.status == "PAGADO" && (
                            <TooltipContent>
                              <p>
                                No se puede eliminar
                                <br />
                                un pago ya realizado
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
        )}
      </TableBody>
    </Table>
  );
};
