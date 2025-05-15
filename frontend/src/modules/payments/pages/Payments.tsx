import { PaymentTable } from "../components/PaymentTable"
import { PaymentSearch } from "../components/PaymentSearch"
import { CustomPagination } from "../components/CustomPagination"
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout"
import { usePaymentsTable } from "../hooks/usePaymentsTable"
import { Route } from "@/shared/constants/route"



export default function PaymentsView() {
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
      
    </DashboardLayout>
  )
}