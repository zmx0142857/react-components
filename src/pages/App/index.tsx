import { FC, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Select } from 'antd'
import { examples } from '../../router'
import './index.less'

const options = examples.map(item => ({ value: item.path, label: item.title }))

const App: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const value = useMemo(() => {
    return examples.find(v => v.path === location.pathname.slice(1))?.title || examples[0].title
  }, [location.pathname])

  return (
    <div className="p-app">
      <div className="p-app-header">
        <Select
          value={value}
          onChange={navigate}
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