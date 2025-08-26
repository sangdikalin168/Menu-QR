ZKTeco poller

This service uses `node-zklib` to connect to ZKTeco attendance devices and fetch attendance logs.

Enable the poller by setting environment variable `ZK_DEVICES` to a JSON array:

Example:

ZK_DEVICES='[{"id":"dev-1","host":"192.168.1.100","port":4370}]'
ZK_POLL_INTERVAL_MS=30000

Install and run:

```bash
cd backend
npm install
npx prisma generate --schema prisma/schema.prisma
npm run dev
```

If you run into Prisma `EPERM` errors on Windows while generating, close editors and node processes that may lock `.prisma` files or run the command as admin.
