import { PrismaClient } from '@prisma/client';
// use require at runtime to avoid missing declaration errors during ts-node startup
// node-zklib exports the class directly (module.exports = ZKLib)
const ZKLib = require('node-zklib');

const prisma = new PrismaClient();

type DeviceConfig = {
    id: string;
    host: string;
    port?: number;
    username?: string;
    password?: string;
    timeout?: number;
    inport?: number;
};

let pollIntervalHandle: ReturnType<typeof setInterval> | null = null;

async function persistRecords(records: Array<{ emp_code: string; punch_time: Date }>) {
    let inserted = 0;
    for (const r of records) {
        // Avoid inserting duplicates: check by emp_code + punch_time
        const exists = await prisma.fingerTransaction.findFirst({ where: { emp_code: r.emp_code, punch_time: r.punch_time } });
        if (exists) continue;
        // No foreign key relation to Employee; store raw device data only
        await prisma.fingerTransaction.create({ data: { emp_code: r.emp_code, punch_time: r.punch_time } });
        inserted += 1;
    }
    return inserted;
}

export async function pollDeviceOnce(device: DeviceConfig): Promise<number> {
    const zk = new ZKLib(device.host, device.port ?? 4370, device.timeout ?? 20000, device.inport ?? undefined);
    try {
        // node-zklib's createSocket() will create and connect the underlying socket
        // (it handles TCP/UDP connect internally). There is no separate `connect()`.
        try {
            await zk.createSocket();
        } catch (err) {
            // failed to create/connect socket
            try { await zk.disconnect(); } catch (_) { /* ignore */ }
            return 0;
        }

        // fetch attendance logs (node-zklib uses getAttendances)
        const logs = await zk.getAttendances();
        // logs is expected to be an array of objects { id, uid, name, state, timestamp }
        const records: Array<{ emp_code: string; punch_time: Date }> = (logs || []).map((l: any) => ({ emp_code: String(l.uid ?? l.pin ?? l.id ?? ''), punch_time: new Date(l.timestamp || l.time || l.date || l.punch_time) }));

        // Log a concise preview of fetched logs
        try {
            const preview = (records || []).slice(0, 10).map(r => ({ emp_code: r.emp_code, punch_time: r.punch_time.toISOString() }));
            console.log(`Fetched ${records.length} raw attendance entries from ${device.host}. Preview:`, preview);
        } catch (e) {
            console.log('Fetched attendance entries (unserializable)');
        }

        const inserted = await persistRecords(records);
        if (inserted > 0) console.log(`Persisted ${inserted} new fingerprint records from ${device.host}`);
        await zk.disconnect();
        return records.length;
    } catch (e) {
        try { await zk.disconnect(); } catch (_) { /* ignore */ }
        return 0;
    }
}

export function startZKTecoPoller(devices: DeviceConfig[], intervalMs = 30000) {
    if (pollIntervalHandle) clearInterval(pollIntervalHandle);
    async function tick() {
        for (const d of devices) {
            try {
                const count = await pollDeviceOnce(d);
                if (count > 0) console.log(`Polled device ${d.host}, got ${count} records`);
            } catch (err) {
                console.error('Error polling device', d.host, err);
            }
        }
    }
    // run immediately then schedule
    tick();
    pollIntervalHandle = setInterval(tick, intervalMs);
}

// Start real-time listeners on devices. The library will invoke the provided
// callback whenever a real-time record arrives.
export async function startZKRealTimeListeners(devices: DeviceConfig[]) {
    for (const device of devices) {
        try {
            const zk = new ZKLib(device.host, device.port ?? 4370, device.timeout ?? 20000, device.inport ?? undefined);
            await zk.createSocket();
            // getRealTimeLogs registers a listener and invokes cb for each real-time record
            zk.getRealTimeLogs(async (rec: any) => {
                try {
                    // Map received record to our storage shape. Typical fields: uid/pin/time
                    const emp_code = String(rec.uid ?? rec.pin ?? rec.id ?? '');
                    const punch_time = new Date(rec.timestamp || rec.time || rec.date || Date.now());
                    console.log('Realtime attendance received from', device.host, { emp_code, punch_time: punch_time.toISOString() });
                    // Persist single record (dedupe inside persistRecords)
                    await persistRecords([{ emp_code, punch_time }]);
                } catch (err) {
                    console.error('Failed to persist realtime record', err);
                }
            });
            console.log(`Realtime listener started for ${device.host}`);
        } catch (err) {
            console.error('Failed to start realtime listener for', device.host, err);
        }
    }
}
