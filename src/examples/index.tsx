import './index.less'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import router from './router'
import { algorithm } from './theme'
import { zhCN } from './locale'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={{ algorithm }} locale={zhCN}>
    <Suspense fallback={"loading..."}>
      <RouterProvider router={router} />
    </Suspense>
  </ConfigProvider>
)
