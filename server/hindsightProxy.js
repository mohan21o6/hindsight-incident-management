/**
 * Hindsight Proxy & Service Middleware
 * 
 * Secure server-side proxy to the official Hindsight API.
 * Ensures HINDSIGHT_API_KEY is never exposed to the client-side bundle.
 * 
 * Endpoints:
 * - GET  /api/hindsight/health
 * - POST /api/hindsight/retain
 * - POST /api/hindsight/recall
 */

import fs from 'fs';
import path from 'path';

function getEnvConfig() {
  const envPath = path.resolve(process.cwd(), '.env');
  const config = {
    apiKey: process.env.HINDSIGHT_API_KEY || '',
    baseUrl: (process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io').replace(/\/$/, ''),
    bankId: process.env.HINDSIGHT_BANK_ID || 'opsmind',
  };

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        const key = k.trim();
        const val = v.join('=').trim().replace(/^["']|["']$/g, '');
        if (key === 'HINDSIGHT_API_KEY' && val) config.apiKey = val;
        if (key === 'HINDSIGHT_BASE_URL' && val) config.baseUrl = val.replace(/\/$/, '');
        if (key === 'HINDSIGHT_BANK_ID' && val) config.bankId = val;
      }
    });
  }

  return config;
}

export function isHindsightConfigured() {
  const { apiKey } = getEnvConfig();
  return Boolean(apiKey && apiKey.trim().length > 0 && !apiKey.includes('<MY_REAL_API_KEY>'));
}

export async function checkHindsightHealth() {
  const { apiKey, baseUrl, bankId } = getEnvConfig();

  if (!isHindsightConfigured()) {
    return {
      status: 'fallback',
      usingRealHindsight: false,
      baseUrl,
      bankId,
      message: 'HINDSIGHT_API_KEY not configured in .env. Running in Local Demo Fallback mode.',
    };
  }

  try {
    // Ping Hindsight Cloud Bank via recall endpoint
    const url = `${baseUrl}/v1/default/banks/${bankId}/memories/recall`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'health check ping',
        types: ['experience'],
        limit: 1,
      }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        status: 'connected',
        usingRealHindsight: true,
        baseUrl,
        bankId,
        message: `Successfully connected to Hindsight Bank '${bankId}'.`,
        bankData: data,
      };
    } else {
      const errText = await res.text().catch(() => '');
      return {
        status: 'error',
        usingRealHindsight: false,
        baseUrl,
        bankId,
        statusCode: res.status,
        message: `Hindsight API returned HTTP ${res.status}: ${errText || res.statusText}`,
      };
    }
  } catch (err) {
    return {
      status: 'error',
      usingRealHindsight: false,
      baseUrl,
      bankId,
      message: `Failed to connect to Hindsight API: ${err.message}`,
    };
  }
}

export async function retainMemory({ documentId, content, metadata, type = 'experience' }) {
  const { apiKey, baseUrl, bankId } = getEnvConfig();

  if (!isHindsightConfigured()) {
    return {
      success: false,
      fallback: true,
      source: 'local_fallback',
      message: 'Hindsight API key not configured. Storing in local demo index.',
    };
  }

  try {
    const url = `${baseUrl}/v1/default/banks/${bankId}/memories`;
    const item = {
      document_id: documentId || `opsmind-${Date.now()}`,
      content,
      metadata: metadata || {},
      type,
    };
    const payload = {
      items: [item],
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: true,
        source: 'hindsight_api',
        memoryId: data.id || documentId,
        data,
      };
    } else {
      const errText = await res.text().catch(() => '');
      return {
        success: false,
        fallback: true,
        source: 'local_fallback',
        error: `Hindsight Retain failed (${res.status}): ${errText}`,
      };
    }
  } catch (err) {
    return {
      success: false,
      fallback: true,
      source: 'local_fallback',
      error: `Hindsight Retain network error: ${err.message}`,
    };
  }
}

export async function recallMemories({ query, types = ['experience', 'observation'], limit = 5 }) {
  const { apiKey, baseUrl, bankId } = getEnvConfig();

  if (!isHindsightConfigured()) {
    return {
      success: false,
      fallback: true,
      source: 'local_fallback',
      message: 'Hindsight API key not configured. Using local similarity engine.',
    };
  }

  try {
    const url = `${baseUrl}/v1/default/banks/${bankId}/memories/recall`;
    const payload = {
      query,
      types,
      limit,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({ results: [] }));
      const memories = Array.isArray(data) ? data : data.results || data.memories || [];
      return {
        success: true,
        source: 'hindsight_api',
        memories,
      };
    } else {
      const errText = await res.text().catch(() => '');
      return {
        success: false,
        fallback: true,
        source: 'local_fallback',
        error: `Hindsight Recall failed (${res.status}): ${errText}`,
      };
    }
  } catch (err) {
    return {
      success: false,
      fallback: true,
      source: 'local_fallback',
      error: `Hindsight Recall network error: ${err.message}`,
    };
  }
}

/**
 * Connect middleware helper for Vite/Express
 */
export function createHindsightMiddleware() {
  return async (req, res, next) => {
    if (!req.url.startsWith('/api/hindsight')) {
      return next();
    }

    const parseBody = () =>
      new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch {
            resolve({});
          }
        });
      });

    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/api/hindsight/health' && req.method === 'GET') {
      const health = await checkHindsightHealth();
      res.end(JSON.stringify(health));
      return;
    }

    if (req.url === '/api/hindsight/retain' && req.method === 'POST') {
      const body = await parseBody();
      const result = await retainMemory(body);
      res.end(JSON.stringify(result));
      return;
    }

    if (req.url === '/api/hindsight/recall' && req.method === 'POST') {
      const body = await parseBody();
      const result = await recallMemories(body);
      res.end(JSON.stringify(result));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  };
}
