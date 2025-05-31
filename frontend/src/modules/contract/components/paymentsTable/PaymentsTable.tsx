import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { formatDate } from "../../utils/formatDate";
import { usePayments } from "../../hooks/usePayments";
import { StateBadge } from "./StateBadge";
import { SortableHeader } from "./SortableHeader";

interface PaymentsTableProps {
  contractId: number;
}

export default function PaymentsTable({ contractId }: PaymentsTableProps) {
  const {
    activeTab,
    setActiveTab,
    sortKey,
    sortDirection,
    handleSort,
    rentPayments,
    otherPayments,
    loading,
    error,
  } = usePayments(contractId);

  if (loading) {
    return <div className="w-full text-center py-6">Cargando datos...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-6 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full space-y-4 my-5">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg">
          <TabsTrigger value="alquiler">Alquiler</TabsTrigger>
          <TabsTrigger value="otros">Otros pagos</TabsTrigger>
        </TabsList>

        <div className="w-full rounded-lg border shadow-sm">
          <TabsContent value="alquiler" className="mt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader
                    label="Fecha"
                    sortKey="paymentDate"
                    currentSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Monto"
                    sortKey="amount"
                    currentSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentPayments.length > 0 ? (
                  rentPayments.map((payment, index) => (
                    <TableRow
                      key={payment.id}
                      className={
                        index % 2 === 0 ? "bg-white" : "bg-neutral-100"
                      }
                    >
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell>${payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <StateBadge state={payment.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      No hay pagos de alquiler disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="otros" className="mt-0">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <SortableHeader
                    label="Concepto"
                    sortKey="serviceType"
                    currentSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Fecha"
                    sortKey="paymentDate"
                    currentSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Monto"
                    sortKey="amount"
                    currentSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherPayments.length > 0 ? (
                  otherPayments.map((payment, index) => (
                    <TableRow
                      key={payment.id}
                      className={index % 2 != 0 ? "bg-gray-100" : ""}
                    >
                      <TableCell>{payment.serviceType}</TableCell>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell>${payment.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      No hay otros pagos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
