// src/types/auth.ts
import type { User } from './user';

export interface AuthState {
    token: string | null;
    user: User | null;
}

export type LoginFn = (token: string, user: User) => void;

export type AuthContextType = {
    token: string | null;
    user: User | null;
    login: LoginFn;
    logout: () => void;
};