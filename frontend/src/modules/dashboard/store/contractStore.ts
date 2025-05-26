import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Contract } from "@/modules/contract/types/contract";
import { getContracts } from "../service/dashboardService";

interface ContractState {
  contracts: Contract[];
  loading: boolean;
  error: string | null;
  fetchContracts: () => Promise<void>;
  reset: () => void;
}

const createFetchContracts = (
  set: (partial: Partial<ContractState>) => void
): (() => Promise<void>) => {
  return async () => {
    set({ loading: true, error: null });
    try {
      const data = await getContracts();
      set({ contracts: data, loading: false });
    } catch (error) {
      set({
        error: (error as Error).message || "Error al cargar contratos",
        loading: false,
      });
    }
  };
};

export const useContractStore = create<ContractState>()(
  persist(
    (set) => {
      const fetchContracts = createFetchContracts(set);
      return {
        contracts: [],
        loading: false,
        error: null,
        fetchContracts,
        reset: () =>
          set({
            contracts: [],
            loading: false,
            error: null,
          }),
      };
    },
    {
      name: "contract-store",
      partialize: (state) => ({ contratos: state.contracts }),
    }
  )
);
