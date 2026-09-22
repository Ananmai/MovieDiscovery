import app from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🎬 Movie Discovery API Server Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🎯 Mode: ${config.tmdb.apiKey ? 'Live TMDB API' : 'Resilient Offline Dataset'}`);
  console.log(`=============================================`);
});

export default server;
