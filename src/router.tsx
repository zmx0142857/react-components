/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'

const App = lazy(() => import('@/pages/App'))
const ImageViewExample = lazy(() => import('@/components/ImageView/example'))
const CronExample = lazy(() => import('@/components/Cron/example'))
const DatGuiExample = lazy(() => import('@/components/DatGui/example'))
const DragWindowExample = lazy(() => import('@/components/DragWindow/example'))
const ImageUploadExample = lazy(() => import('@/components/FormItems/ImageUpload/example'))
const EditFormExample = lazy(() => import('@/components/EditForm/example'))

export const examples = [
  {
    path: 'cron',
    title: 'Cron',
    element: <CronExample />,
  },
  {
    path: 'dat-gui',
    title: 'DatGui',
    element: <DatGuiExample />,
  },
  {
    path: 'drag-window',
    title: 'DragWindow',
    element: <DragWindowExample />,
  },
  {
    path: 'edit-form',
    title: 'EditForm',
    element: <EditFormExample />,
  },
  {
    path: 'image-upload',
    title: 'ImageUpload',
    element: <ImageUploadExample />,
  },
  {
    path: 'image-view',
    title: 'ImageView',
    element: <ImageViewExample />,
  },
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to="image-view" />,
      },
      ...examples,
    ]
  },
])

export default router