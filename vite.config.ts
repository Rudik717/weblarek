import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  base: mode === 'production'
    ? '/weblarek/'
    : '/',

  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          './src/scss'
        ],
      },
    },
  },
}))