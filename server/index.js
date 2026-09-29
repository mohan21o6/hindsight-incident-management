/**
 * Standalone Production Server for OpsMind AI + Hindsight API
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { createHindsightMiddleware, checkHindsightHealth } from './hindsightProxy.js';

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const hindsightMiddleware = createHindsightMiddleware();

const server = http.createServer(async (req, res) => {
  // 1. API routes
  if (req.url.startsWith('/api/hindsight')) {
    return hindsightMiddleware(req, res, () => {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not found' }));
    });
  }

  // 2. Static files
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('OpsMind build not found. Run npm run build first.');
  }
});

server.listen(PORT, async () => {
  const health = await checkHindsightHealth();
  console.log(`[OpsMind Server] Running on http://localhost:${PORT}`);
  console.log(`[Hindsight Status] ${health.message} (${health.status})`);
});
