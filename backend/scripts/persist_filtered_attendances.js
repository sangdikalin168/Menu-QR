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
        await zk.createSocket();
        let users = [];
        try {
            const ures = await zk.getUsers();
            users = Array.isArray(ures) ? ures : (ures && ures.data ? ures.data : []);
        } catch (e) {
            console.warn('getUsers failed (continuing):', e);
        }

        const res = await zk.getAttendances();
        const logs = res && res.data ? res.data : (Array.isArray(res) ? res : []);

        const userById = new Map();
        for (const u of users) {
            const key = String(u.uid ?? u.userId ?? u.pin ?? u.id ?? '');
            userById.set(key, u.name ?? u.username ?? (u.userId || u.uid || ''));
        }

        const mapped = logs.map(l => {
            const id = String(l.deviceUserId ?? l.uid ?? l.userId ?? l.userSn ?? l.pin ?? l.id ?? '');
            const recordTime = l.recordTime || l.timestamp || l.time || l.date || l.punch_time;
            return { emp_code: id, punch_time: recordTime ? new Date(recordTime) : null, raw: l, name: userById.get(id) ?? null };
        }).filter(r => r.punch_time && !isNaN(r.punch_time.getTime()));

        const targetDate = '2025-08-23';
        const toInsert = mapped.filter(rec => rec.punch_time.toISOString().slice(0, 10) === targetDate);
        console.log(`Found ${toInsert.length} records for ${targetDate}`);

        let inserted = 0;
        const insertedRows = [];
        for (const r of toInsert) {
            const exists = await prisma.fingerTransaction.findFirst({ where: { emp_code: r.emp_code, punch_time: r.punch_time } });
            if (exists) continue;
            const created = await prisma.fingerTransaction.create({ data: { emp_code: r.emp_code, punch_time: r.punch_time } });
            inserted += 1;
            insertedRows.push(created);
        }

        console.log(`Inserted ${inserted} new rows.`);
        if (insertedRows.length) console.log('Sample inserted rows:', JSON.stringify(insertedRows.slice(0, 10), null, 2));

        await zk.disconnect();
        await prisma.$disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error during persist:', err);
        try { await zk.disconnect(); } catch (_) { }
        try { await prisma.$disconnect(); } catch (_) { }
        process.exit(2);
    }
})();
