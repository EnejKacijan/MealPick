import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { handleMealsRequest } from './backend/controllers/mealsController.mjs';
import { handleIngredientResolveRequest } from './backend/controllers/ingredientsController.mjs';

async function loadEnvFile() {
  try {
    const raw = await readFile(new URL('./.env', import.meta.url), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (!process.env[key]) {
        process.env[key] = rest.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    // .env is optional.
  }
}

await loadEnvFile();

const PORT = Number(process.env.PORT || 5173);
const ROOT = process.cwd();

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.jsx': 'text/babel; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
};

function staticPath(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  return join(ROOT, clean === '/' ? 'MealPick.html' : clean);
}

async function serveStatic(request, response) {
  const filePath = staticPath(new URL(request.url, `http://${request.headers.host}`).pathname);
  const data = await readFile(filePath);
  response.writeHead(200, {
    'Content-Type': CONTENT_TYPES[extname(filePath)] || 'application/octet-stream',
  });
  response.end(data);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === '/api/meals') {
      await handleMealsRequest(request, response);
      return;
    }
    if (url.pathname === '/api/ingredients/resolve') {
      await handleIngredientResolveRequest(request, response);
      return;
    }

    await serveStatic(request, response);
  } catch (error) {
    const status = error.code === 'ENOENT' ? 404 : 500;
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ error: status === 404 ? 'Not found' : error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`MealPick running at http://localhost:${PORT}/MealPick.html`);
  console.log(`Meals API at http://localhost:${PORT}/api/meals`);
});
