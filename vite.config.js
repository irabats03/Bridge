import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { chatResponse } from './server/chat.mjs';

export default defineConfig(({ mode }) => {
  const key = process.env.GEMINI_API_KEY || loadEnv(mode, process.cwd(), 'GEMINI_API_KEY').GEMINI_API_KEY;
  return {
    plugins: [
      tailwindcss(),
      {
        name: 'bridge-local-chat',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            const origin = 'http://' + req.headers.host;
            const body = req.method === 'POST' ? { body: req, duplex: 'half' } : {};
            const request = new Request(origin + '/api/chat', { method: req.method, headers: req.headers, ...body });
            const response = await chatResponse(request, key);
            res.writeHead(response.status, Object.fromEntries(response.headers));
            res.end(Buffer.from(await response.arrayBuffer()));
          });
        }
      }
    ],
    esbuild: { jsx: 'automatic' },
    build: { outDir: 'dist/client', assetsInlineLimit: 0 }
  };
});
