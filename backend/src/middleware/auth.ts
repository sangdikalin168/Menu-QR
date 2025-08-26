import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

const prisma = new PrismaClient();

export async function authenticateJWT(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
        // If payload is a string, return null
        if (typeof payload !== 'object' || !payload.userId) return null;
        // Fetch user from DB for fresh data, including role and permissions
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: { role: { include: { permissions: true } } }
        });
        if (!user || !user.role) return null;
        return {
            id: user.id,
            username: user.username ?? user.phone,
            display_name: user.display_name ?? user.phone,
            role: {
                id: user.role.id,
                name: user.role.name,
                description: user.role.description,
                createdAt: user.role.createdAt,
                updatedAt: user.role.updatedAt,
                permissions: user.role.permissions.map((perm: any) => ({
                    id: perm.id,
                    name: perm.name,
                    description: perm.description,
                    createdAt: perm.createdAt,
                    updatedAt: perm.updatedAt
                }))
            }
        };
    } catch {
        return null;
    }
}
