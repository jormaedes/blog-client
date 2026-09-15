import { create } from 'zustand'
import type { UserState, User } from '@/types/auth'
import { getToken, getCurrentUser } from '@/lib/api';

const useAuthStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,

  setUser: (userData: User) => set({
    user: userData,
    isAuthenticated: true,
  }),

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  restoreAuth: async () => {
    try {
      const token = getToken();

      if (!token) return;

      const payload = await getCurrentUser(token);

      set({
        user: payload,
        isAuthenticated: true,
      });
    } catch {
      get().logout();
    } finally {
      set({
        isAuthLoading: false
      })
    }
  }
}));

export default useAuthStore
