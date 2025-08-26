// backend/scripts/backfillLeaveBalance.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run({ years = [new Date().getFullYear()] } = {}) {
    const batchSize = 200;
    let skip = 0;
    while (true) {
        const employees = await prisma.employee.findMany({
            select: { id: true, hire_date: true },
            skip,
            take: batchSize,
        });
        if (!employees.length) break;

        for (const emp of employees) {
            for (const year of years) {
                // compute used days for approved leaves in that year
                const start = new Date(Date.UTC(year, 0, 1));
                const end = new Date(Date.UTC(year + 1, 0, 1));
                const usedAgg = await prisma.leave.aggregate({
                    _sum: { leave_day: true },
                    where: {
                        employee_id: emp.id,
                        status: 'APPROVED',
                        start_time: { gte: start, lt: end },
                    },
                });
                const used = Number((usedAgg._sum.leave_day) || 0);

                // entitlement: choose your policy (here default 12)
                const entitlement = 12.0;

                await prisma.leaveBalance.upsert({
                    where: { employee_id_year: { employee_id: emp.id, year } },
                    update: { used, entitlement },
                    create: { employee_id: emp.id, year, used, entitlement },
                });
            }
        }

        skip += employees.length;
    }

    await prisma.$disconnect();
    console.log('Backfill completed');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});