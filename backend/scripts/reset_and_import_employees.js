const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

function readZKDevicesFromEnvFile() {
    const envFile = path.resolve(process.cwd(), '.env.development');
    if (!fs.existsSync(envFile)) return undefined;
    const content = fs.readFileSync(envFile, 'utf8');
    const match = content.match(/^ZK_DEVICES=(.*)$/m);
    if (!match) return undefined;
    let v = match[1].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
    }
    return v;
}

(async function main() {
    const raw = process.env.ZK_DEVICES ?? readZKDevicesFromEnvFile();
    if (!raw) {
        console.error('No ZK_DEVICES configured in env or .env.development');
        process.exit(1);
    }
    let devices = [];
    try { devices = JSON.parse(raw); } catch (e) { console.error('Failed to parse ZK_DEVICES JSON', e); process.exit(1); }
    if (!devices.length) { console.error('No devices found in ZK_DEVICES'); process.exit(1); }
    const device = devices[0];

    console.log('Connecting to device:', device);
    const ZKLib = require('node-zklib');
    const zk = new ZKLib(device.host, device.port ?? 4370, device.timeout ?? 60000, device.inport ?? undefined);
    const prisma = new PrismaClient();

    try {
        // TRUNCATE employees with cascade to remove dependent rows if any
        console.log('Truncating Employee table (CASCADE) ...');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "Employee" RESTART IDENTITY CASCADE');
        console.log('Truncate successful.');

        await zk.createSocket();
        const ures = await zk.getUsers();
        const users = Array.isArray(ures) ? ures : (ures && ures.data ? ures.data : []);

        const data = users.map(u => ({
            emp_code: String(u.userId ?? u.uid ?? u.pin ?? ''),
            name: u.name ?? u.username ?? ''
        })).filter(x => x.emp_code);

        console.log(`Inserting ${data.length} employees...`);
        // use createMany for bulk insert
        if (data.length) {
            // createMany doesn't return created rows; use skipDuplicates to avoid errors
            await prisma.employee.createMany({ data, skipDuplicates: true });
        }

        const count = await prisma.employee.count();
        console.log(`Employee table now has ${count} rows.`);

        await zk.disconnect();
        await prisma.$disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error during reset/import:', err);
        try { await zk.disconnect(); } catch (_) { }
        try { await prisma.$disconnect(); } catch (_) { }
        process.exit(2);
    }
})();
