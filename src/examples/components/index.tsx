/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'

const ImageViewExample = lazy(() => import('./ImageView'))
const CronExample = lazy(() => import('./Cron'))
const DatGuiExample = lazy(() => import('./DatGui'))
const DragWindowExample = lazy(() => import('./DragWindow'))
const ImageUploadExample = lazy(() => import('./ImageUpload'))
const EditFormExample = lazy(() => import('./EditForm'))
const ObjectEditorExample = lazy(() => import('./ObjectEditor'))
const LogDataExample = lazy(() => import('./LogData'))

const examples = [
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

export default examples
