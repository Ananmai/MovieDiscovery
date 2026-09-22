import app from './src/app.js';
import { config } from './src/config/index.js';

const PORT = process.env.PORT || config.port || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Express server listening on port ${PORT}`);
  });
}

export default app;
