import fs from 'fs';
import path from 'path';

function readZKDevicesFromEnvFile(): string | undefined {
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

async function main() {
    const raw = process.env.ZK_DEVICES ?? readZKDevicesFromEnvFile();
    if (!raw) {
        console.error('No ZK_DEVICES configured in env or .env.development');
        process.exit(1);
    }

    let devices: any[] = [];
    try { devices = JSON.parse(raw); } catch (e) { console.error('Failed to parse ZK_DEVICES JSON', e); process.exit(1); }
    if (!devices.length) { console.error('No devices found in ZK_DEVICES'); process.exit(1); }

    const device = devices[0];
    console.log('Polling device:', device);

    // Use runtime require to avoid TypeScript declaration issues
    const ZKLib = require('node-zklib');

    // Increase timeout for large attendance dumps
    const zk = new ZKLib(device.host, device.port ?? 4370, device.timeout ?? 60000, device.inport ?? undefined);

    try {
        // create and connect socket
        await zk.createSocket();

        // get device info first
        try {
            const info = await zk.getInfo();
            console.log('Device info:', info);
        } catch (e) {
            console.warn('getInfo failed (continuing):', e);
        }

        // get users
        try {
            const users = await zk.getUsers();
            console.log('Users count:', Array.isArray(users) ? users.length : 'unknown', typeof users === 'object' ? JSON.stringify(users).slice(0, 200) : users);
        } catch (e) {
            console.warn('getUsers failed (continuing):', e);
        }

        // progress callback for long transfers
        let lastPercent = -1;
        const progressCb = (percent: number, total?: number) => {
            const p = Math.floor(percent);
            if (p !== lastPercent) {
                lastPercent = p;
                console.log(`download progress: ${p}%${total ? ` (total: ${total})` : ''}`);
            }
        };

        // fetch attendances with progress callback
        let res: any;
        try {
            res = await zk.getAttendances(progressCb);
        } catch (e) {
            console.error('getAttendances failed:', e);
            try { await zk.disconnect(); } catch (_) { }
            process.exit(2);
        }

        if (!res) {
            console.error('getAttendances returned empty result');
            try { await zk.disconnect(); } catch (_) { }
            process.exit(2);
        }

        // node-zklib may return { data, err } or an array
        const logs = res && res.data ? res.data : (Array.isArray(res) ? res : []);
        console.log('Fetched attendances count:', logs.length);
        if (logs.length) console.log('Sample record:', logs[0]);

        await zk.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error polling device:', err);
        try { await zk.disconnect(); } catch (_) { }
        process.exit(2);
    }
}

main();
