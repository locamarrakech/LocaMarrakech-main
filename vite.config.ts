import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePluginApi } from './vite-plugin-api';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

// Function to copy API files to dist folder after build
function copyApiFiles() {
  return {
    name: 'copy-api-files',
    closeBundle() {
      // Create dist/api directory if it doesn't exist
      const distApiDir = path.resolve(__dirname, 'dist/api');
      if (!existsSync(distApiDir)) {
        mkdirSync(distApiDir, { recursive: true });
      }
      
      // Copy API files
      const apiFiles = [
        'api/send-email.js',
        'api/contact.js',
        'api/test.js'
      ];
      
      apiFiles.forEach(file => {
        const srcPath = path.resolve(__dirname, file);
        const destPath = path.resolve(__dirname, 'dist', file);
        
        if (existsSync(srcPath)) {
          // Create destination directory if it doesn't exist
          const destDir = path.dirname(destPath);
          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
          }
          
          copyFileSync(srcPath, destPath);
          console.log(`Copied ${file} to dist folder`);
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: process.env.VERCEL_ENV ? '/' : '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), vitePluginApi(), copyApiFiles()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      ssr: {
        external: ['whatsapp-web.js', 'nodemailer', 'dotenv'],
        noExternal: [],
      },
      optimizeDeps: {
        exclude: ['whatsapp-web.js'],
      },
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
          },
        },
        outDir: 'dist',
      },
    };
});