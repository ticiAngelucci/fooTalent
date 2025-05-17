export interface Payment {
  id: number
  contractId: number
  tenantName: string
  propertyAddress: string
  adjustmentFrequency: string
  amount: number
  deadline: number
  status: string
  adjustmentType: string
  serviceType: string
}

export interface ApiResponse {
  dto: Payment[]
  page: number
  size: number
  totalElements?: number
  totalPages?: number
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}