export interface Payment {
  id: number;
  contractId: number;
  amount: number;
  dueDate: string;
  paymentDate: string;
  status: string;
  paymentMethod: string;
  currency: string;
  description: string;
  serviceType: string;
  period: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  tenantName: string;
  overdue: boolean;
}

export interface ApiResponse {
  dto: Payment[];
  page: number;
  size: number;
}

