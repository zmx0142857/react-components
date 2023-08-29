import { Button, ButtonProps, Form } from 'antd'
import formItems from '../FormItems'
import { pickBy } from '@/utils'
import { forwardRef, useImperativeHandle } from 'react'
import './index.less'

type ItemType = {
  type: string
  name: string
  label: string
  initialValue?: undefined | null | number | string | object
  required?: boolean
  itemProps?: object
}

interface BtnType extends ButtonProps {
  title: string
}

type EditFormProps = {
  name?: string
  items?: ItemType[]
  btns?: BtnType[]
  onFinish?: (values: object) => void
  onCancel?: () => void
}

/**
 * 编辑表单
 * @param props.name 表单名称 (html 属性)
 * @param props.items 表单字段
 * @param props.btns 表单按钮
 * @param props.onFinish 提交表单
 * @param props.onCancel 取消表单
 */
const EditForm = forwardRef(({
  name = 'default',
  items = [],
  btns,
  onFinish,
  onCancel,
}: EditFormProps, ref) => {

  const [form] = Form.useForm()
  useImperativeHandle(ref, () => form)

  const renderItem = (item: ItemType) => {
    const { type, name, label, required, initialValue, itemProps, ...props } = item
    const V = formItems[type]
    if (!V) {
      console.error('invalid component type', type)
      return null
    }
    return (
      <Form.Item key={name}
        name={name}
        label={label}
        required={required}
        initialValue={initialValue}
        valuePropName={V.valuePropName}
        {...itemProps}
      >
        <V.component {...props} />
      </Form.Item>
    )
  }

  const defaultBtn: BtnType[] = [
    { type: 'primary', htmlType: 'submit', title: '提交' },
    { onClick: onCancel, title: '取消' },
  ]
  btns = btns || defaultBtn

  const onFormFinish = (values: object) => {
    return onFinish?.(pickBy(values, v => v !== undefined))
  }

  return (
    <Form
      className="c-edit-form"
      form={form}
      name={name}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={onFormFinish}
    >
      {items.map(renderItem)}
      <div className="c-edit-form-footer">
        {btns.map((btn, index) =>
          <Button key={index} {...btn}>{btn.title}</Button>
        )}
      </div>
    </Form>
  )
})

export default EditForm