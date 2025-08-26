import startServer from './app';
import { connectRedis } from '../services/redis.service';
import { startZKTecoPoller, startZKRealTimeListeners } from '../services/zkteco.service';


const PORT = process.env.PORT || 4000;

async function main() {
  await connectRedis();
  const app = await startServer();

  // start zkteco poller if devices configured in env
  try {
    const raw = process.env.ZK_DEVICES || '';
    if (raw) {
      const devices = JSON.parse(raw);
      startZKTecoPoller(devices, Number(process.env.ZK_POLL_INTERVAL_MS || 30000));
      console.log('ZKTeco poller started for devices:', devices.map((d: any) => d.host));
      // optionally start realtime listeners
      if (process.env.ZK_REALTIME === '1' || process.env.ZK_REALTIME === 'true') {
        startZKRealTimeListeners(devices).catch((err) => console.error('Failed to start realtime listeners', err));
      }
    }
  } catch (e) {
    console.error('Failed to start ZKTeco poller', e);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

main();
