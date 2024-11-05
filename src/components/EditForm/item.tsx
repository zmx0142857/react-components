import { Form } from 'antd'
import type { ItemType } from '.'
import formItems from '../FormItems'
import FormCard from './card'

const renderItem = (item: ItemType) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, key, name, label, showLabel = true, showDeleteBtn = true, operator, required, tooltip, rules, validator, initialValue, itemProps, render, ...props } = item
  const V = formItems[type]
  if (!V) {
    console.error('invalid component type', type)
    return null
  }
  return (
    <Form.Item key={key || name}
      name={name}
      label={showLabel && label}
      required={required}
      initialValue={initialValue}
      valuePropName={V.valuePropName}
      tooltip={tooltip}
      // 优先级: rules > validator > required
      rules={
        rules ? rules :
          validator ? [{ validator }] :
            required ? [{ required: true }] :
              undefined
      }
      {...itemProps}
    >
      {render ? render(item) :
        item.type === 'Card' ? <FormCard item={item} /> :
          <V.component {...props} />
      }
    </Form.Item>
  )
}

export default renderItem