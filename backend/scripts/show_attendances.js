const fs = require('fs');
const path = require('path');

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

    try {
        await zk.createSocket();

        // progress callback
        let last = -1;
        const progress = (percent, total) => {
            const p = Math.floor(percent);
            if (p !== last) {
                last = p;
                process.stdout.write(`download progress: ${p}%\r`);
            }
        };

        // fetch users to map ids to names
        let users = [];
        try {
            const ures = await zk.getUsers();
            users = Array.isArray(ures) ? ures : (ures && ures.data ? ures.data : []);
            console.log('Users fetched:', users.length);
        } catch (e) {
            console.warn('getUsers failed (continuing):', e);
        }

        const res = await zk.getAttendances(progress);
        const logs = res && res.data ? res.data : (Array.isArray(res) ? res : []);
        // map name onto logs where possible. known fields: deviceUserId, userSn, uid, pin
        const userById = new Map();
        for (const u of users) {
            // device can provide uid, userId, pin as id fields depending on firmware
            const key = String(u.uid ?? u.userId ?? u.pin ?? u.id ?? '');
            userById.set(key, u.name ?? u.username ?? (u.userId || u.uid || ''));
        }
        const mapped = logs.map(l => {
            const id = String(l.deviceUserId ?? l.uid ?? l.userId ?? l.userSn ?? l.pin ?? l.id ?? '');
            return { ...l, name: userById.get(id) ?? null };
        });

        // filter to a single ISO date (YYYY-MM-DD)
        const targetDate = '2025-08-23';
        const filtered = mapped.filter(rec => {
            try {
                const t = new Date(rec.recordTime || rec.timestamp || rec.time || rec.date || rec.punch_time);
                if (!t || isNaN(t.getTime())) return false;
                return t.toISOString().slice(0, 10) === targetDate;
            } catch (e) {
                return false;
            }
        });

        console.log(`\nRecords on ${targetDate}: ${filtered.length}`);
        console.log(`\nFetched ${logs.length} attendance records (showing filtered)`);

        const MAX_PRINT = 200;
        if (filtered.length > MAX_PRINT) {
            console.log(`Showing first ${MAX_PRINT} records out of ${filtered.length}:`);
            console.log(JSON.stringify(filtered.slice(0, MAX_PRINT), null, 2));
        } else {
            console.log(JSON.stringify(filtered, null, 2));
        }

        await zk.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Failed to fetch attendances:', err);
        try { await zk.disconnect(); } catch (_) { }
        process.exit(2);
    }
})();
