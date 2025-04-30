import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; //uses middleware storage

interface UserState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  setUser: (token: string, username: string) => void;
  logout: () => void;
}

//Persist will store user data into client storage
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'user-storage', // this is the client storage name
      storage: createJSONStorage(() => sessionStorage), // handle data Parse / Json Stringify
    }
  )
);
