import { Navigate, createBrowserRouter } from 'react-router-dom'
import examples from './components'
import { lazy } from 'react'

const App = lazy(() => import('./app'))

type Router = ReturnType<typeof createBrowserRouter>
const router: Router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: 'Oops... Something is wrong.',
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