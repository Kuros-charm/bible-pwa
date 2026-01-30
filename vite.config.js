import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  // 2. Define the conditional base path
  // If we run "vite build --mode github", use the repo path.
  // Otherwise, use '/' (default).
  const base = mode === 'github' ? '/bible-pwa-gh-page/' : '/';

  return {
    base,
    plugins: [
      tailwindcss(),
      VitePWA({
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
          runtimeCaching: [
            {
              // Match: unpkg, cdnjs, and tailwind cdn
              urlPattern: /^https:\/\/(unpkg\.com|cdnjs\.cloudflare\.com)\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdn-libraries',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  // IMPORTANT: 0 is required because your script tags 
                  // don't have crossorigin="anonymous"
                  statuses: [0, 200]
                }
              }
            },
            {
              // Match: Google Fonts Stylesheets (The CSS file)
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-cache',
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Match: Google Fonts Webfonts (The actual .woff2 files)
              // Note: The CSS above points to these files
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },

        devOptions: {
          enabled: false,
          navigateFallback: 'index.html',
          suppressWarnings: true,
          type: 'module',
        },
      })],
  }
})