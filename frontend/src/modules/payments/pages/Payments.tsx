import { PaymentTable } from "../components/PaymentTable"
import { PaymentSearch } from "../components/PaymentSearch"
import { CustomPagination } from "../components/CustomPagination"
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout"
import { usePaymentsTable } from "../hooks/usePaymentsTable"
import { Route } from "@/shared/constants/route"
import PaymentRegister from "./PaymentRegister"
import { usePaymentModal } from "../hooks/usePaymentsModal"
import DeletePaymentsModal from "../components/DeletePaymentsModal"
import { useDeletePaymentModal } from "../hooks/useDeletePaymentModal"



export default function PaymentsView() {

  const {modalOpen, setModalOpen, userId, userName, userAddress, handleOpen} = usePaymentModal();
    const {deleteOpen, setDeleteOpen, deleteId, handleDelete} = useDeletePaymentModal();

  const {
    sortData,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    loading,
    sortedData,
    filteredData
  } = usePaymentsTable(10)


  return (
    <DashboardLayout subtitle="Pagos"
    redirect={Route.Dashboard}
    >
      
      <div className="rounded-md border mt-4 overflow-x-auto">
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <PaymentSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className="border rounded-md">
            <PaymentTable
              payments={sortedData}
              loading={loading}
              sortData={sortData}
              handleOpen={handleOpen}
              handleDelete={handleDelete}
            />
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredData.length} de {totalElements} pagos
              </div>
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
      <PaymentRegister open={modalOpen} setOpen={setModalOpen} id={userId} userName={userName} address={userAddress} />
      <DeletePaymentsModal open={deleteOpen} setOpen={setDeleteOpen} id={deleteId} />
    </DashboardLayout>
  )
}