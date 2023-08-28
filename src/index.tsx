import ReactDOM from 'react-dom/client'
import './index.css'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { ConfigProvider, theme } from 'antd'

const algorithm = window.matchMedia('(prefers-color-scheme: dark)')?.matches ? theme.darkAlgorithm : theme.defaultAlgorithm;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={{ algorithm }}>
    <Suspense fallback={"loading..."}>
      <RouterProvider router={router} />
    </Suspense>
  </ConfigProvider>
)
