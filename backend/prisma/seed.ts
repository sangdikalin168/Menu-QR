import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Seed permissions
    const permissions = await prisma.permission.createMany({
        data: [
            { name: 'user:create', description: 'Create users' },
            { name: 'user:read', description: 'Read users' },
            { name: 'user:update', description: 'Update users' },
            { name: 'user:delete', description: 'Delete users' },
            { name: 'report:view', description: 'View reports' },
        ],
        skipDuplicates: true,
    });

    // Fetch all permissions
    const allPermissions = await prisma.permission.findMany();

    // Seed roles with permissions
    const adminRole = await prisma.role.create({
        data: {
            name: 'ADMIN',
            description: 'Administrator',
            permissions: {
                connect: allPermissions.map((p) => ({ id: p.id })),
            },
        },
    });
    const managerRole = await prisma.role.create({
        data: {
            name: 'MANAGER',
            description: 'Manager',
            permissions: {
                connect: allPermissions.filter((p) => p.name !== 'user:delete').map((p) => ({ id: p.id })),
            },
        },
    });

    // Seed a user with ADMIN role
    const passwordHash = await bcrypt.hash('123', 10);
    await prisma.user.create({
        data: {
            phone: '081397820',
            password: passwordHash,
            username: 'admin',
            display_name: 'Admin',
            role: {
                connect: { id: adminRole.id },
            },
        },
    });

    // Add more seed data as needed
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
