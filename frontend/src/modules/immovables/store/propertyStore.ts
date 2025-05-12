import { create } from 'zustand';
import { Property } from '../types/property';
import { fetchAllProperties } from '../servises/propertyServises';


interface PropertyState {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  fetchProperties: () => Promise<void>;
  setProperties: (properties: Property[]) => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  isLoading: false,
  error: null,
  
  fetchProperties: async () => {
    set({ isLoading: true, error: null });
    try {
      const properties = await fetchAllProperties();
      set({ properties, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error 
          ? error.message 
          : "Error al cargar los inmuebles. Por favor, intente nuevamente.", 
        isLoading: false 
      });
    }
  },
  
  setProperties: (properties) => set({ properties }),
}));