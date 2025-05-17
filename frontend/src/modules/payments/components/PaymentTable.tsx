import { ChevronsUpDown, DollarSign, MoreHorizontal, MoveUpRight, Trash2 } from "lucide-react"
import { PaymentStatusBadge } from "./PaymentStatusBadge"
import { Button } from "@/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { formatDeadline } from "../servises/paymentService"
import { Payment } from "../types/pyments"
import { Route } from "@/shared/constants/route"
import { Link } from "react-router-dom"

interface PaymentTableProps {
  payments: Payment[]
  loading: boolean
  sortData: (column: keyof Payment) => void
  handleOpen: (id: string, name: string, address: string) => void;
  handleDelete: (id: string) => void;
}

export const PaymentTable = ({
  payments,
  loading,
  sortData,
  handleOpen,
  handleDelete
}: PaymentTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="w-12"></TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("tenantName")}
              className="flex items-center gap-1 font-medium"
            >
              Contrato
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("propertyAddress")}
              className="flex items-center gap-1 font-medium"
            >
              Dirección
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("adjustmentFrequency")}
              className="flex items-center gap-1 font-medium"
            >
              Ajuste
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("amount")}
              className="flex items-center gap-1 font-medium"
            >
              Índice
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("amount")}
              className="flex items-center gap-1 font-medium"
            >
              Valor de alquiler
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("deadline")}
              className="flex items-center gap-1 font-medium"
            >
              Fecha límite
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => sortData("status")}
              className="flex items-center gap-1 font-medium"
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
            <TableCell colSpan={8} className="text-center py-4">Cargando pagos...</TableCell>
          </TableRow>
        ) : payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4">No se encontraron pagos</TableCell>
          </TableRow>
        ) : (
          payments
            .filter((payment) => payment.serviceType === "ALQUILER")
            .map((payment) => (
              <TableRow key={payment.id}>
                <TableCell></TableCell>
                <TableCell className="font-medium">{payment.tenantName}</TableCell>
                <TableCell>{payment.propertyAddress}</TableCell>
                <TableCell>{payment.adjustmentFrequency}</TableCell>
                <TableCell>{payment.adjustmentType}</TableCell>
                <TableCell>$ {payment.amount.toLocaleString()}</TableCell>
                <TableCell>{formatDeadline(payment.deadline)}</TableCell>
                <TableCell><PaymentStatusBadge status={payment.status} /></TableCell>
                <TableCell>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem >
                        <Link
                          className="text-neutral-950"
                          to={Route.EditContract}
                          state={{ contract: payment }}
                        >
                          <MoveUpRight className="text-neutral-950 inline" /> Acceder
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpen(payment.contractId.toString(), payment.tenantName, payment.propertyAddress)}>
                        <DollarSign />Registrar pago
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(payment.contractId.toString())}>
                        <Trash2 /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
        )}
      </TableBody>
    </Table >
  )
}