import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tenant } from "@/modules/tenant/types/tenant";
import { getTenants } from "../service/dashboardService"; // Ajusta el path si es necesario

interface TenantState {
  tenants: Tenant[];
  loading: boolean;
  error: string | null;
  fetchTenants: () => Promise<void>;
  reset: () => void;
}

const createFetchTenants = (
  set: (partial: Partial<TenantState>) => void
): (() => Promise<void>) => {
  return async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTenants();
      set({ tenants: data, loading: false });
    } catch (error) {
      set({
        error: (error as Error).message || "Error al cargar inquilinos",
        loading: false,
      });
    }
  };
};

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => {
      const fetchTenants = createFetchTenants(set);
      return {
        tenants: [],
        loading: false,
        error: null,
        fetchTenants,
        reset: () =>
          set({
            tenants: [],
            loading: false,
            error: null,
          }),
      };
    },
    {
      name: "tenant-store",
      partialize: (state) => ({ tenants: state.tenants }),
    }
  )
);
