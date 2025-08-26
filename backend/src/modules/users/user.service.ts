import { User } from './user.model';
import { PrismaClient } from '@prisma/client';

export class UserService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getUserById(id: string): Promise<User | null> {
        const dbUser = await this.prisma.user.findUnique({
            where: { id: Number(id) },
            include: { role: { include: { permissions: true } } }
        });
        if (!dbUser || !dbUser.role) return null;
        return {
            id: dbUser.id,
            phone: dbUser.phone,
            password: dbUser.password,
            username: dbUser.username ?? undefined,
            display_name: dbUser.display_name ?? undefined,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
            role: {
                id: dbUser.role.id,
                name: dbUser.role.name,
                description: dbUser.role.description ?? undefined,
                createdAt: dbUser.role.createdAt,
                updatedAt: dbUser.role.updatedAt,
                permissions: dbUser.role.permissions.map((perm: any) => ({
                    id: perm.id,
                    name: perm.name,
                    description: perm.description,
                    createdAt: perm.createdAt,
                    updatedAt: perm.updatedAt
                }))
            }
        };
    }

    async findByPhone(phone: string): Promise<User | null> {
        const dbUser = await this.prisma.user.findUnique({
            where: { phone },
            include: { role: { include: { permissions: true } } }
        });
        if (!dbUser || !dbUser.role) return null;
        return {
            id: dbUser.id,
            phone: dbUser.phone,
            password: dbUser.password,
            username: dbUser.username ?? undefined,
            display_name: dbUser.display_name ?? undefined,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
            role: {
                id: dbUser.role.id,
                name: dbUser.role.name,
                description: dbUser.role.description ?? undefined,
                createdAt: dbUser.role.createdAt,
                updatedAt: dbUser.role.updatedAt,
                permissions: dbUser.role.permissions.map((perm: any) => ({
                    id: perm.id,
                    name: perm.name,
                    description: perm.description,
                    createdAt: perm.createdAt,
                    updatedAt: perm.updatedAt
                }))
            }
        };
    }

    async saveRefreshToken(userId: number, token: string, expiresAt: Date): Promise<void> {
        await this.prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });
    }
}
