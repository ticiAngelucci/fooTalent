import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPayments } from '../service/dashboardService';

export type EstadoPago = 'PENDIENTE' | 'VENCIDO' | 'PAGADO';

export interface Payment {
  id: number;
  contractId: number;
  amount: number;
  status: EstadoPago;
  tenantName: string;
  propertyAddress: string;
  adjustmentFrequency: 'MENSUAL' | 'TRIMESTRAL' | 'ANUAL';
  adjustmentType: 'ICL' | 'UVA' | 'OTRO';
  deadline: number;
}

interface PaymentState {
  pagos: Payment[];
  loading: boolean;
  error: string | null;
  fetchPagos: () => Promise<void>;
}

// Esta función hace la llamada y actualiza el estado del store
const createFetchPayments = (set: (partial: Partial<PaymentState>) => void): (() => Promise<void>) => {
  return async () => {
    set({ loading: true, error: null });
    try {
      const pagos = await getPayments();
      set({ pagos, loading: false });
    } catch (error) {
      set({
        error: (error as Error).message || 'Error al cargar pagos',
        loading: false,
      });
    }
  };
};

export const usePagosStore = create<PaymentState>()(
  persist(
    (set) => {
      const fetchPagos = createFetchPayments(set);
      return {
        pagos: [],
        loading: false,
        error: null,
        fetchPagos,
      };
    },
    {
      name: 'pagos-storage',
      partialize: (state) => ({ pagos: state.pagos }),
    }
  )
);