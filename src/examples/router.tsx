import { Navigate, createBrowserRouter } from 'react-router-dom'
import examples from './components'
import App from './app'

const router = createBrowserRouter([
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