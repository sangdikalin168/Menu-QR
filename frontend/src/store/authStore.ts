// src/store/authStore.ts
import { create } from 'zustand';
import { client } from '../config/apollo';
import { gql } from '@apollo/client';

interface AuthState {
    isAuthChecked: boolean;
    isAuthenticated: boolean;
    user: import('../types/user').User | null;
    accessToken: string;
    refreshTokenIntervalId: NodeJS.Timeout | null;
    setAuthChecked: (checked: boolean) => void;
    setUser: (user: AuthState['user']) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
    initializeRefreshTokenTimer: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthChecked: false,
    isAuthenticated: false,
    user: null,
    accessToken: '',
    refreshTokenIntervalId: null,
    setAuthChecked: (isAuthChecked) => set({ isAuthChecked }),
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setAccessToken: (accessToken) => set({ accessToken }),
    logout: () => {
        const intervalId = get().refreshTokenIntervalId;
        if (intervalId) {
            clearInterval(intervalId);
        }
        set({ user: null, isAuthenticated: false, accessToken: '', refreshTokenIntervalId: null });
    },
    initializeRefreshTokenTimer: () => {
        const intervalId = get().refreshTokenIntervalId;
        if (intervalId) {
            clearInterval(intervalId);
        }

        const newIntervalId = setInterval(async () => {
            if (get().isAuthenticated) {
                try {
                    const { data } = await client.mutate({
                        mutation: gql`
                            mutation RefreshToken {
                                refreshToken {
                                    accessToken
                                }
                            }
                        `,
                    });
                    if (data.refreshToken.accessToken) {
                        get().setAccessToken(data.refreshToken.accessToken);
                    }
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                    get().logout();
                }
            }
        }, 14 * 60 * 1000); // 14 minutes

        set({ refreshTokenIntervalId: newIntervalId });
    },
}));