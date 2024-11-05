import { Card, Space } from 'antd'
import { ItemType } from '.'
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import renderItem from './item'
import { FC } from 'react'

const FormCard: FC<{ item: ItemType }> = ({ item }) => {
  return (
    <Card title={item.label + (item.name + 1)}
      extra={
        <Space>
          <UpOutlined onClick={() => item.operator!.move(item.name, item.name - 1)} />
          <DownOutlined onClick={() => item.operator!.move(item.name, item.name + 1)} />
          <CloseOutlined onClick={() => item.operator!.remove(item.name)} />
        </Space>
      }
    >
      {(item as ItemType & { items: ItemType[] }).items.map(v => renderItem({
        ...v,
        key: v.name,
        name: [item.name, v.name],
        itemProps: {
          labelCol: { xs: { span: 24 }, sm: { span: 6 } },
          wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
        }
      }))}
    </Card>
  )
}

export default FormCard