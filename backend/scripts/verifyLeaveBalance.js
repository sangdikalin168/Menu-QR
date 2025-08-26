// verifyLeaveBalance.js
// Compares persisted LeaveBalance.used with computed sums from Leave (approved) for target years.
// Usage: node scripts/verifyLeaveBalance.js 2025,2024

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify(years) {
    const epsilon = 0.01; // tolerance for float rounding
    const mismatches = [];

    for (const year of years) {
        console.log(`Verifying year ${year}...`);

        // paginate through LeaveBalance rows for the year
        const pageSize = 500;
        let skip = 0;
        while (true) {
            const rows = await prisma.leaveBalance.findMany({
                where: { year: Number(year) },
                select: { id: true, employee_id: true, used: true },
                skip,
                take: pageSize,
            });
            if (!rows.length) break;

            for (const r of rows) {
                const agg = await prisma.leave.aggregate({
                    _sum: { leave_day: true },
                    where: {
                        employee_id: r.employee_id,
                        status: 'APPROVED',
                        start_time: {
                            gte: new Date(Date.UTC(Number(year), 0, 1)),
                            lt: new Date(Date.UTC(Number(year) + 1, 0, 1)),
                        },
                    },
                });

                const computed = Number((agg._sum.leave_day) || 0);
                const persisted = Number(r.used || 0);
                const diff = Math.abs(persisted - computed);
                if (diff > epsilon) {
                    mismatches.push({ id: r.id, employee_id: r.employee_id, year: Number(year), persisted, computed, diff });
                }
            }

            skip += rows.length;
        }
    }

    if (mismatches.length) {
        console.log(`Found ${mismatches.length} mismatches (showing up to 50):`);
        console.table(mismatches.slice(0, 50));
        await prisma.$disconnect();
        process.exitCode = 2;
        return;
    }

    console.log('All checked LeaveBalance rows match computed approved leave sums.');
    await prisma.$disconnect();
}

const arg = process.argv[2];
const years = arg ? arg.split(',').map(s => s.trim()) : [new Date().getFullYear()];
verify(years).catch(err => {
    console.error(err);
    process.exit(1);
});
