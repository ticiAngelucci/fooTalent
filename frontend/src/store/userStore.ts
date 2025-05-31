import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { API_URL } from "@/shared/constants/api";

interface UserState {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profileImageUrl: string | null;
  role: string | null;
  isActive: boolean;
  token: string | null;
  isAuthenticated: boolean;

  login: (token: string) => void;
  setUser: (userData: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string;
    role: string;
    isActive: boolean;
  }) => void;

  getCredentials: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      profileImageUrl: null,
      role: null,
      isActive: false,
      token: null,
      isAuthenticated: false,

      login: (token: string) => {
        localStorage.setItem("token", token);
        set({ token, isAuthenticated: true });
      },

      setUser: ({ id, firstName, lastName, email, profileImageUrl, role, isActive }) => {
        set({
          id,
          firstName,
          lastName,
          email,
          profileImageUrl,
          role,
          isActive,
          isAuthenticated: true,
        });
      },

      getCredentials: async () => {
        const token = get().token || localStorage.getItem("token");
        if (!token) return;

        try {
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = response.data;
          get().setUser(user);
          set({ token, isAuthenticated: true });
        } catch (error) {
          get().logout();
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.clear();
        sessionStorage.clear();
        set({
          id: null,
          firstName: null,
          lastName: null,
          email: null,
          profileImageUrl: null,
          role: null,
          isActive: false,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
