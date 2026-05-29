import './config/env'; // validate env vars first
import { connectDB } from './config/db';
import app from './app';
import { env } from './config/env';

const PORT = Number(env.PORT);

async function start(): Promise<void> {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start();
