import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwindcss from '@tailwindcss/vite'
import replace from '@rollup/plugin-replace';
import renameFiles from './plugins/renameFiles'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        },
      ],
    }),
    replace({
      preventAssignment: true,
      '_commonjsHelpers.js': "commonjsHelpers.js",
    }),
    renameFiles({
      filenames: {
        '_commonjsHelpers.js': 'commonjsHelpers.js'
      }
    })
  ],
  build: {
    minify: false,
    outDir: 'build',
    target: 'chrome92',
    rollupOptions: {
      input: {
        main: './popup.html',
        background: './src/background.js',
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});