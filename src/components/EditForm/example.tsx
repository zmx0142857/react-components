import EditForm from '.'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { FormType } from '.'
import { fetchGradeOptions, hometownOptions } from './example.config'
import { useRef } from 'react'

const EditFormExample = () => {

  const form = useRef<FormType>()

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
      initialValue: 1,
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
      fetch: fetchGradeOptions,
    },
    {
      label: '出生日期',
      name: 'birthday',
      type: 'DatePicker',
      showTime: true,
      initialValue: dayjs(),
      onChange: (value: Dayjs) => {
        const age = dayjs().diff(value, 'y')
        form.current?.setFieldsValue({ age })
      },
    },
    {
      label: '年龄',
      name: 'age',
      type: 'InputNumber',
      initialValue: 18,
      tooltip: '修改出生日期, 年龄跟着改变',
    },
    {
      label: '已接种疫苗',
      name: 'isVaccinated',
      type: 'Switch',
      initialValue: true,
    },
    {
      label: '爱好',
      name: 'hobby',
      type: 'Checkbox',
      initialValue: [0, 1, 2],
      options: [
        { value: 0, label: '唱' },
        { value: 1, label: '跳' },
        { value: 2, label: 'Rap' },
        { value: 3, label: '篮球' },
      ],
    },
    {
      label: '家乡',
      name: 'hometown',
      type: 'Cascader',
      initialValue: ['350000', '350100', '350103'],
      options: hometownOptions,
    },
  ]

  const onFinish = (values: object) => {
    console.log('onFinish', values)
  }

  const onCancel = () => {
    console.log('onCancel')
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