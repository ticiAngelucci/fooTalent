import { create } from 'zustand';

interface UserState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  setUser: (token: string, username: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  username: null,
  isAuthenticated: false,

  setUser: (token, username) => {
    set({
      token,
      username,
      isAuthenticated: true,
    });
    sessionStorage.setItem('token', token);
  },

  logout: () => {
    set({
      token: null,
      username: null,
      isAuthenticated: false,
    });
    sessionStorage.removeItem('token');
  },
}));