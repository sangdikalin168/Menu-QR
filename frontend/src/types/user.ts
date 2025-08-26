// src/types/user.ts
export interface Permission {
    id: number;
    name: string;
    description?: string;
}

export interface Role {
    id: number;
    name: string;
    description?: string;
    permissions: Permission[];
}

export interface User {
    id: number;
    username: string;
    display_name: string;
    role: Role;
}