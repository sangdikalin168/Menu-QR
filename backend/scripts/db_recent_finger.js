const { PrismaClient } = require('@prisma/client');
(async function () {
    const p = new PrismaClient();
    try {
        const rows = await p.fingerTransaction.findMany({ orderBy: { punch_time: 'desc' }, take: 10 });
        console.log('Recent fingerTransaction rows:', JSON.stringify(rows, null, 2));
    } catch (e) {
        console.error('DB query failed', e);
        process.exit(1);
    } finally {
        await p.$disconnect();
    }
})();
