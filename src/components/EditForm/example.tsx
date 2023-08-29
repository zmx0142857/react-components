import { useRef } from 'react'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import EditForm from '.'

const EditFormExample = () => {

  const form = useRef<any>()

  const editForm = [
    {
      label: '姓名',
      name: 'name',
      type: 'Input',
      initialValue: 'Fran',
      required: true,
    },
    {
      label: '性别',
      name: 'gender',
      type: 'Radio',
      initialValue: 1, // FIXME: this default value doesn't work
      options: [
        { value: 0, label: '女' },
        { value: 1, label: '男' },
      ],
      required: true,
    },
    {
      label: '年级',
      name: 'grade',
      type: 'Select',
      initialValue: 2,
      options: [
        { value: 1, label: '一年级' },
        { value: 2, label: '二年级' },
        { value: 3, label: '三年级' },
        { value: 4, label: '四年级' },
        { value: 5, label: '五年级' },
        { value: 6, label: '六年级' },
      ],
    },
    {
      label: '出生日期',
      name: 'birthday',
      type: 'DatePicker',
      initialValue: dayjs(),
      // 修改出生日期, 年龄跟着改变
      onChange: (value: Dayjs) => {
        const age = dayjs().diff(value, 'y')
        form.current?.setFieldValue('age', age)
      },
    },
    {
      label: '年龄',
      name: 'age',
      type: 'InputNumber',
      initialValue: 18,
    },
    {
      label: '已接种疫苗',
      name: 'isVaccinated',
      type: 'Switch',
      initialValue: true,
    }
  ]

  const onFinish = (values: object) => {
    console.log('onFinish', values)
  }

  const onCancel = () => {
    console.log('onCancel')
    // 参考 antd Form.useForm 的返回值, 可以调用的方法有:
    // getFieldValue getFieldsValue getFieldError getFieldsError getFieldWarning
    // isFieldsTouched isFieldTouched isFieldValidating isFieldsValidating resetFields
    // setFields setFieldValue setFieldsValue validateFields submit
    form.current?.resetFields()
  }

  return (
    <EditForm
      ref={form}
      name="my-form"
      items={editForm}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  )
}

export default EditFormExample