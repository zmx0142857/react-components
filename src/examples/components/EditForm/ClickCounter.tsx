import { FC, useEffect, useState } from 'react'
import { Button, Space, Typography } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

const { Text } = Typography

type ClickCounterProps = {
  value?: number
  onChange?: (value: number) => void
}

const ClickCounter: FC<ClickCounterProps> = ({ value, onChange }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (value !== undefined) setCount(value)
  }, [value])

  const onClick = () => {
    setCount(count + 1)
    onChange?.(count + 1)
  }

  return (
    <Space>
      <Button type="primary" onClick={onClick} icon={<SmileOutlined />}>点我</Button>
      <Text type="secondary">
        ({count})
      </Text>
    </Space>
  )
}

export default ClickCounter