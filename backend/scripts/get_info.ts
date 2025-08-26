async function main() {
    const raw = process.env.ZK_DEVICES;
    if (!raw) {
        console.error('No ZK_DEVICES in env');
        process.exit(1);
    }
    let devices: any[] = [];
    try { devices = JSON.parse(raw); } catch (e) { console.error('Invalid ZK_DEVICES JSON', e); process.exit(1); }
    const device = devices[0];
    console.log('Checking device info for', device);
    const ZKLib = require('node-zklib');
    const zk = new ZKLib(device.host, device.port ?? 4370, device.timeout ?? 20000, device.inport ?? undefined);
    try {
        await zk.createSocket();
        const info = await zk.getInfo();
        console.log('Device info:', JSON.stringify(info, null, 2).slice(0, 10000));
        await zk.disconnect();
    } catch (err) {
        console.error('getInfo error:', err);
        try { await zk.disconnect(); } catch (_) { }
        process.exit(2);
    }
}

main();
