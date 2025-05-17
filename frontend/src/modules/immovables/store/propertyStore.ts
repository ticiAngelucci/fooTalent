import { create } from 'zustand';
import { defaultPageSize, Property } from '../types/property';
import { fetchAllProperties } from '../servises/propertyServises';

interface PropertyState {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  totalElements: number;
  fetchProperties: (page?: number, size?: number) => Promise<void>;
  setProperties: (properties: Property[]) => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  isLoading: false,
  error: null,
  totalPages: 0,
  totalElements: 0,
  fetchProperties: async (page = 0, size = defaultPageSize) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchAllProperties(page, size);
      
      set({
        properties: response.content,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error
          ? error.message
          : "Error al cargar los inmuebles. Por favor, intente nuevamente.",
        isLoading: false,
      });
    }
  },
  setProperties: (properties) => set({ properties }),
}));