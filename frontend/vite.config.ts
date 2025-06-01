import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function handleModuleDirectivesPlugin() {
  return {
    name: 'handle-module-directives-plugin',
    transform(code, id) {
      if (id.includes('@vkontakte/icons')) {
        code = code.replace(/"use-client";?/g, '')
      }
      return { code }
    },
  }
}

/**
 * Some chunks may be large.
 * This will not affect the loading speed of the site.
 * We collect several versions of scripts that are applied depending on the browser version.
 * This is done so that your code runs equally well on the site and in the odr.
 * The details are here: https://dev.vk.com/mini-apps/development/on-demand-resources.
 */
export default defineConfig({
  base: './',

  plugins: [
    react(),
    handleModuleDirectivesPlugin(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],

  resolve: {
    alias: {
      '@app': resolve(__dirname, './src/app'),
      '@entities': resolve(__dirname, './src/entities'),
      '@features': resolve(__dirname, './src/features'),
      '@pages': resolve(__dirname, './src/pages'),
      '@shared': resolve(__dirname, './src/shared'),
      '@widgets': resolve(__dirname, './src/widgets'),
    },
  },

  build: {
    outDir: 'build',
  },
})
