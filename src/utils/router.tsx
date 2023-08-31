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
const ObjectEditorExample = lazy(() => import('@/components/ObjectEditor/example'))
const LogDataExample = lazy(() => import('@/components/LogData/example'))

export const examples = [
  {
    path: 'Cron',
    element: <CronExample />,
  },
  {
    path: 'DatGui',
    element: <DatGuiExample />,
  },
  {
    path: 'DragWindow',
    element: <DragWindowExample />,
  },
  {
    path: 'EditForm',
    element: <EditFormExample />,
  },
  {
    path: 'ImageUpload',
    element: <ImageUploadExample />,
  },
  {
    path: 'ImageView',
    element: <ImageViewExample />,
  },
  {
    path: 'ObjectEditor',
    element: <ObjectEditorExample />,
  },
  {
    path: 'LogData',
    element: <LogDataExample />,
  }
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: '404 Not Found',
    children: [
      {
        path: '/',
        element: <Navigate to="ImageView" />,
      },
      ...examples,
    ]
  },
])

export default router