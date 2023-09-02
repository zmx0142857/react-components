import { FC, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Select } from 'antd'
import { examples } from '@/utils/router'
import './index.less'

const options = examples.map(item => ({ value: item.path, label: item.path }))

const App: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const value = useMemo(() => {
    return examples.find(v => v.path === location.pathname.slice(1))?.path || examples[0].path
  }, [location.pathname])

  return (
    <div className="p-app">
      <div className="p-app-header">
        <Select
          value={value}
          onChange={value => navigate(value)}
          options={options}
          showSearch
        />
      </div>
      <div className="p-app-body">
        <Outlet />
      </div>
    </div>
  )
}

export default App