/// <reference types="jest" />

import { resolvers } from '../organization.resolvers';

// Mock Prisma client used in the resolver file
jest.mock('@prisma/client', () => {
    const items = [
        { id: 1, emp_code: 'E001', punch_time: new Date('2025-08-23T08:00:00Z') },
        { id: 2, emp_code: 'E002', punch_time: new Date('2025-08-23T09:00:00Z') },
        { id: 3, emp_code: 'E001', punch_time: new Date('2025-08-23T10:00:00Z') },
    ];

    const prismaMock = {
        fingerTransaction: {
            findMany: jest.fn(({ where, orderBy, skip, take }) => {
                // simple filter by emp_code and since
                let res = items.slice();
                if (where && where.emp_code) res = res.filter((r) => r.emp_code === where.emp_code);
                if (where && where.punch_time && where.punch_time.gt) res = res.filter((r) => r.punch_time > where.punch_time.gt);
                // order desc by punch_time
                res = res.sort((a, b) => b.punch_time.getTime() - a.punch_time.getTime());
                if (typeof skip === 'number') res = res.slice(skip);
                if (typeof take === 'number') res = res.slice(0, take);
                return Promise.resolve(res);
            }),
            count: jest.fn(({ where }) => {
                let res = items.slice();
                if (where && where.emp_code) res = res.filter((r) => r.emp_code === where.emp_code);
                if (where && where.punch_time && where.punch_time.gt) res = res.filter((r) => r.punch_time > where.punch_time.gt);
                return Promise.resolve(res.length);
            }),
        },
    };

    return { PrismaClient: jest.fn(() => prismaMock) };
});

describe('fingerprintTransactionsPage resolver', () => {
    it('returns paginated items and total', async () => {
        const result: any = await (resolvers.Query as any).fingerprintTransactionsPage(null, { since: '2025-08-23T00:00:00.000Z', skip: 0, take: 2 });
        expect(result.total).toBe(3);
        expect(result.items.length).toBe(2);
        // ensure ordering is desc
        expect(result.items[0].punch_time.getTime()).toBeGreaterThan(result.items[1].punch_time.getTime());
    });

    it('filters by emp_code and paginates', async () => {
        const result: any = await (resolvers.Query as any).fingerprintTransactionsPage(null, { since: '2025-08-23T00:00:00.000Z', skip: 0, take: 10, emp_code: 'E001' });
        expect(result.total).toBe(2);
        expect(result.items.length).toBe(2);
        expect(result.items.every((i: any) => i.emp_code === 'E001')).toBe(true);
    });
});
