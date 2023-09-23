import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'

const outDir = 'lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      outDir,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  // 库模式 https://cn.vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      entry: {
        main: path.resolve(__dirname, 'src/components/index.ts'),
        hooks: path.resolve(__dirname, 'src/hooks/index.ts'),
      },
      name: 'ReactComponents',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        switch (format) {
          case 'es': return entryName + '.js'
          case 'cjs': return entryName + '.cjs'
          default: return ''
        }
      }
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd'],
      output: {
        dir: outDir,
      },
    },
  },
})
