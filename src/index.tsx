import './index.less'
import ReactDOM from 'react-dom/client'
import router from './utils/router'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import { algorithm } from './utils/theme'
import { zhCN } from './utils/locale'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={{ algorithm }} locale={zhCN}>
    <Suspense fallback={"loading..."}>
      <RouterProvider router={router} />
    </Suspense>
  </ConfigProvider>
)
