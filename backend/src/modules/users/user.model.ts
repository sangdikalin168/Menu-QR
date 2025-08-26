// User model matching Prisma schema
export type UserID = number;

export interface Permission {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Role {
    id: number;
    name: string;
    description?: string;
    permissions: Permission[];
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: UserID;
    phone: string;
    password: string;
    username?: string;
    display_name?: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
