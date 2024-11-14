import { Button, Form, Typography } from 'antd'
import type { ItemType } from '.'
import renderItem from './item'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Any } from '@/utils/types'

const { Link } = Typography

const renderList = (item: ItemType) => {
  const showDeleteBtn = item.showDeleteBtn === undefined ? item.type !== 'Card*' : item.showDeleteBtn
  return (
    <Form.List
      key={item.name}
      name={item.name}
      initialValue={item.initialValue as Any[]}
    >
      {(fields, operator) => {
        return <>
          {fields.map(({ key, name }) => (
            <div className="c-edit-form-list-item" key={key}>
              {renderItem({
                ...item,
                type: item.type.replace(/\*$/, ''),
                initialValue: undefined,
                showLabel: name === 0,
                key: String(name),
                name,
                operator,
              })}
              {showDeleteBtn ?
                <Link className="c-edit-form-list-delete" onClick={() => operator.remove(name)}>
                  <MinusCircleOutlined />
                </Link>
              : <div className="c-edit-form-list-delete" />
              }
              </div>
          ))}
          <Form.Item label={fields.length === 0 ? item.label : ''}>
            <Button
              className="c-edit-form-list-add"
              type="dashed"
              onClick={() => operator.add()}
              icon={<PlusOutlined />}
            >添加{item.label}</Button>
          </Form.Item>
        </>
      }}
    </Form.List>
  )
}

export default renderList