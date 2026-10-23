import { useState } from 'react'
import { Card, Space, Tag, Typography } from 'antd'
import { SelectInput } from '@/components'
import { pagerApi } from '@/utils'

const staticOptions = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'orange', label: '橘子' },
]

const fruitOptions = Array.from({ length: 23 }).map((_, i) => ({
  value: i + 1,
  label: '水果 ' + (i + 1),
}))
const fetchFruitOptions = pagerApi('selectInputFruitOptions', fruitOptions)

const SelectInputExample = () => {
  const [staticValue, setStaticValue] = useState<string | number>()
  const [fetchValue, setFetchValue] = useState<string | number>()

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%', padding: 24 }}>
      <Typography.Title level={4} style={{ margin: 0 }}>SelectInput</Typography.Title>

      <Space align="start" wrap>
        <Card title="静态 options + selectFirst" size="small" style={{ width: 360 }}>
          <SelectInput
            style={{ width: '100%' }}
            options={staticOptions}
            selectFirst
            value={staticValue}
            onChange={value => setStaticValue(value as string | number)}
            placeholder="请选择水果"
          />
          <Typography.Paragraph style={{ margin: '12px 0 0' }}>
            当前值: <Tag>{staticValue ?? '未选择'}</Tag>
          </Typography.Paragraph>
        </Card>

        <Card title="fetch + selectFirst" size="small" style={{ width: 360 }}>
          <SelectInput
            style={{ width: '100%' }}
            fetch={fetchFruitOptions}
            selectFirst
            value={fetchValue}
            onChange={value => setFetchValue(value as string | number)}
            placeholder="请选择水果"
          />
          <Typography.Paragraph style={{ margin: '12px 0 0' }}>
            当前值: <Tag>{fetchValue ?? '未选择'}</Tag>
          </Typography.Paragraph>
        </Card>
      </Space>

      <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
        传入 selectFirst 后，静态选项会直接选中第一项；使用 fetch 时，会在接口返回第一页数据后选中第一项。
      </Typography.Paragraph>
    </Space>
  )
}

export default SelectInputExample
