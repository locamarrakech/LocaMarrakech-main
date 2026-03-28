import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export function vitePluginApi(): Plugin {
  return {
    name: 'vite-plugin-api',
    configureServer(server) {
      // Pre-initialize WhatsApp when server starts (async, non-blocking)
      setTimeout(async () => {
        try {
          const { config } = await import('dotenv');
          const { resolve } = await import('path');
          config({ path: resolve(process.cwd(), '.env.local') });
          config({ path: resolve(process.cwd(), '.env') });
          
          const whatsappNumber = process.env.WHATSAPP_NUMBER;
          if (whatsappNumber) {
            console.log('📱 [Server] Pre-initializing WhatsApp...');
            const service = await import('@/services/whatsappService');
            service.preInitializeWhatsApp();
          }
        } catch (error) {
          // Silently fail - WhatsApp is optional
          console.log('📱 [Server] WhatsApp pre-initialization skipped');
        }
      }, 2000); // Wait 2 seconds for server to be ready
      
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url?.startsWith('/api/')) {
          try {
            const apiPath = req.url.replace('/api/', '').split('?')[0];
            const handlerPath = resolve(__dirname, 'pages', 'api', `${apiPath}.ts`);
            
            // Check if file exists
            if (!existsSync(handlerPath)) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, message: 'API route not found' }));
              return;
            }
            
            // Use relative path from project root for Vite to resolve
            const relativePath = `./pages/api/${apiPath}.ts`;
            
            // Use Vite's ssrLoadModule for server-side module loading
            // This properly handles TypeScript and ESM
            const handlerModule = await server.ssrLoadModule(relativePath);
            const handler = handlerModule.default;
            
            if (typeof handler === 'function') {
              // Create a mock req/res object compatible with Next.js style
              const mockReq = {
                method: req.method || 'GET',
                url: req.url,
                body: await getRequestBody(req),
                headers: req.headers,
              };
              
              const mockRes = {
                status: (code: number) => ({
                  json: (data: any) => {
                    res.statusCode = code;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                  },
                }),
              };
              
              await handler(mockReq, mockRes);
            } else {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, message: 'Handler not found' }));
            }
          } catch (error: any) {
            console.error('API route error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: error.message || 'Internal server error' }));
          }
        } else {
          next();
        }
      });
    },
  };
}

async function getRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

