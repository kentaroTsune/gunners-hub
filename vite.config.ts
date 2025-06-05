import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // 環境変数をロード
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/deepl': {
          target: 'https://api-free.deepl.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/deepl/, ''),
          headers: {
            'Authorization': `DeepL-Auth-Key ${env.VITE_DEEPL_API_KEY}`
          }
        }
      }
    }
  };
});
