import './index.less'
import formItems from '../FormItems'
import type { ReactNode } from 'react'
import { Any } from '@/utils/types'
import type { FormRule } from 'antd'
import { Button, ButtonProps, Form } from 'antd'
import { forwardRef, useImperativeHandle } from 'react'
import { filter } from '@/utils'

type ItemType = {
  type: string
  name: string
  label: string
  tooltip?: ReactNode
  rules?: FormRule[]
  initialValue?: Any
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

export type EditFormRef = ReturnType<typeof Form.useForm>[0]

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
    const { type, name, label, required, tooltip, rules, initialValue, itemProps, ...props } = item
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
        tooltip={tooltip}
        rules={required && !rules ? [{ required: true }] : rules}
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

  const onFormFinish = async (values: object) => {
    return onFinish?.(filter(values, v => v !== undefined))
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