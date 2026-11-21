import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, relative } from 'node:path';

const manifestText = await readFile('.openai/hosting.json', 'utf8').catch(error => {
  if (error.code === 'ENOENT') return null;
  throw error;
});
const files = (await readdir('dist/client', { recursive: true, withFileTypes: true })).filter(entry => entry.isFile());
const mime = { '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const assets = {};
for (const file of files) {
  const source = file.parentPath + '/' + file.name;
  assets['/' + relative('dist/client', source)] = [mime[extname(source)] ?? 'application/octet-stream', (await readFile(source)).toString('base64')];
}
const safety = await readFile('src/data/safety.mjs', 'utf8');
const chat = (await readFile('server/chat.mjs', 'utf8')).split('\n').slice(1).join('\n');
const worker = `
${safety}
${chat}
const assets = ${JSON.stringify(assets)};
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/chat') return chatResponse(request, env.GEMINI_API_KEY);
    if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405 });
    const route = ['/', '/checkout', '/privacy', '/terms', '/contact'].includes(pathname.replace(/\\/$/, '') || '/');
    const asset = Object.hasOwn(assets, pathname) ? assets[pathname] : route ? assets['/index.html'] : null;
    if (!asset) return new Response('Page not found', { status: 404 });
    const [mime, bytes] = asset;
    return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(bytes), char => char.charCodeAt(0)), {
      headers: { 'Content-Type': mime, 'Cache-Control': pathname.startsWith('/assets/') ? 'public,max-age=31536000,immutable' : 'no-cache', 'X-Content-Type-Options': 'nosniff' }
    });
  }
};
`;
await mkdir('dist/server', { recursive: true });
await writeFile('dist/server/index.js', worker);
if (manifestText !== null) {
  const manifest = JSON.parse(manifestText);
  delete manifest.static;
  await mkdir('dist/.openai', { recursive: true });
  await writeFile('dist/.openai/hosting.json', JSON.stringify(manifest, null, 2));
}
