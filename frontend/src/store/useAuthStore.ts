import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    _hasHydrated: boolean;
    
    // Actions
    setAuth: (user: User, token: string) => void;
    setUser: (user: User) => void; // Added for profile updates
    setAccessToken: (token: string) => void;
    setHasHydrated: (state: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            _hasHydrated: false, 

            setAuth: (user, accessToken) => set({ user, accessToken }),
            setUser: (user) => set({ user }), // Implementation
            setAccessToken: (accessToken) => set({ accessToken }),
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            logout: () => set({ user: null, accessToken: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user }), 
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);