import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProperties } from "../service/dashboardService";
import { Property } from "../types/property.types";

interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  fetchProperties: () => Promise<void>;
  reset: () => void;
}

const createFetchProperties = (
  set: (partial: Partial<PropertyState>) => void
): (() => Promise<void>) => {
  return async () => {
    set({ loading: true, error: null });
    try {
      const data = await getProperties(); // debe devolver Property[]
      set({ properties: data, loading: false });
    } catch (error) {
      set({
        error: (error as Error).message || "Error al cargar propiedades",
        loading: false,
      });
    }
  };
};

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set) => {
      const fetchProperties = createFetchProperties(set);
      return {
        properties: [],
        loading: false,
        error: null,
        fetchProperties,
        reset: () =>
          set({
            properties: [],
            loading: false,
            error: null,
          }),
      };
    },
    {
      name: "property-store",
      partialize: (state) => ({ properties: state.properties }),
    }
  )
);