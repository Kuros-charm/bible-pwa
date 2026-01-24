import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  
  // 2. Define the conditional base path
  // If we run "vite build --mode github", use the repo path.
  // Otherwise, use '/' (default).
  const base = mode === 'github' ? '/bible-pwa-gh-page/' : '/';

  return {
    base,
    plugins: [VitePWA({
      registerType: 'prompt',
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'bible-pwa',
        short_name: 'bible-pwa',
        description: 'bible-pwa',
        theme_color: '#ffffff',
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    })],
  }})