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
        const ures = await zk.getUsers();
        const users = Array.isArray(ures) ? ures : (ures && ures.data ? ures.data : []);

        // Normalize output
        const out = users.map(u => ({
            uid: u.uid ?? null,
            userId: u.userId ?? null,
            pin: u.pin ?? null,
            name: u.name ?? u.username ?? null,
            password: u.password ?? null,
            cardno: u.cardno ?? null,
            role: u.role ?? null
        }));

        console.log(`Fetched ${out.length} users`);
        console.log(JSON.stringify(out, null, 2));

        await zk.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Failed to fetch users:', err);
        try { await zk.disconnect(); } catch (_) { }
        process.exit(2);
    }
})();
