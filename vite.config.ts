import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
      fileName: 'main',
    },
    rollupOptions: {
      external: ['react', 'antd'],
      output: {
        globals: {
          react: 'React',
        }
      }
    },
  }
})
