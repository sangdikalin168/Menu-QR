import startServer from './app';
import { connectRedis } from '../services/redis.service';


const PORT = process.env.PORT || 4000;

async function main() {
  await connectRedis();
  const app = await startServer();

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

main();
