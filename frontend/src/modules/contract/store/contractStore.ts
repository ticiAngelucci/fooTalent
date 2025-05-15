import { create } from 'zustand';
import { defaultPageSize, Contract } from '../types/contract';
import { fetchAllContracts } from '../services/ListContractsService';

interface ContractState {
  contracts: Contract[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  totalElements: number;
  fetchContracts: (page?: number, size?: number) => Promise<void>;
  setContracts: (contracts: Contract[]) => void;
}

export const useContractStore = create<ContractState>((set) => ({
  contracts: [],
  isLoading: false,
  error: null,
  totalPages: 0,
  totalElements: 0,
  fetchContracts: async (page = 0, size = defaultPageSize) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchAllContracts(page, size);
      
      set({
        contracts: response.content,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error
          ? error.message
          : "Error al cargar los contratos. Por favor, intente nuevamente.",
        isLoading: false,
      });
    }
  },
  setContracts: (contracts) => set({ contracts }),
}));