import './index.less'
import renderItem from './item'
import type { FormRule } from 'antd'
import type { ReactNode } from 'react'
import type { FormListOperation } from 'antd/lib'
import { Any } from '@/utils/types'
import { Button, ButtonProps, Form } from 'antd'
import { NamePath } from 'antd/es/form/interface'
import { filter } from '@/utils'
import { forwardRef, useImperativeHandle } from 'react'
import renderList from './list'
import classNames from 'classnames'

export type RenderType = (item: ItemType) => ReactNode

export type ItemType = {
  type: string
  name: NamePath
  key?: string
  label?: string
  showLabel?: boolean
  showDeleteBtn?: boolean
  tooltip?: ReactNode
  rules?: FormRule[]
  initialValue?: Any
  required?: boolean
  itemProps?: object
  render?: RenderType
  validator?: (rule: FormRule, value: string) => Promise<void>
  operator?: FormListOperation
}

export type EditFormProps = {
  className?: string
  name?: string
  items?: ItemType[]
  btns?: ButtonProps[]
  cols?: number[]
  onFinish?: (values: object) => void
  onCancel?: () => void
}

export type EditFormRef = ReturnType<typeof Form.useForm>[0]

/**
 * 编辑表单
 * @param props.name 表单名称 (html 属性)
 * @param props.items 表单字段
 * @param props.btns 表单按钮
 * @param props.cols 表单布局, 例如 [4, 20]
 * @param props.onFinish 提交表单
 * @param props.onCancel 取消表单
 */
const EditForm = forwardRef(({
  className = '',
  name = 'default',
  items = [],
  btns,
  cols,
  onFinish,
  onCancel,
}: EditFormProps, ref) => {

  const [form] = Form.useForm()
  useImperativeHandle(ref, () => form)

  btns = btns || [
    { type: 'primary', htmlType: 'submit', title: '提交' },
    { onClick: onCancel, title: '取消' },
  ]

  const onFormFinish = async (values: object) => {
    return onFinish?.(filter(values, v => v !== undefined))
  }

  const render = (item: ItemType) => {
    if (item.type.endsWith('*')) {
      return renderList(item)
    }
    return renderItem(item)
  }

  return (
    <Form
      className={classNames('c-edit-form', className)}
      form={form}
      name={name}
      labelWrap
      labelCol={cols ? { span: cols[0] } : { xs: { span: 24 }, sm: { span: 6 } }}
      wrapperCol={cols ? { span: cols[1] } : { xs: { span: 24 }, sm: { span: 18 } }}
      onFinish={onFormFinish}
    >
      {items.map(render)}
      <div className="c-edit-form-footer">
        {btns.map((btn, index) =>
          <Button key={index} {...btn}>{btn.title}</Button>
        )}
      </div>
    </Form>
  )
})

export default EditForm