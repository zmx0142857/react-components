import { EditForm, type EditFormRef } from '@/components'
// import dayjs, { type Dayjs } from 'dayjs'
// import { fetchEquipments, fetchGradeOptions, hometownOptions } from './config'
import { useRef } from 'react'
import { Typography } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

const { Text } = Typography

const EditFormExample = () => {

  const form = useRef<EditFormRef>()

  const contactForm = [
    {
      label: '姓名',
      name: 'name',
      type: 'Input',
      required: true,
    },
    {
      label: '手机号',
      name: 'phone',
      type: 'Input',
      required: true,
      async validator(_: object, value: string) {
        if (!value) throw new Error('请输入手机号')
        if (!/^1[3-9]\d{9}$/.test(value)) throw new Error('手机号格式不正确')
      },
    },
  ]

  const editForm = [
    /*
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
      allowClear: true,
      fetch: fetchGradeOptions,
      rules: [
        { required: true, message: '请选择年级' },
      ],
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
    {
      label: '照片',
      name: 'photo',
      type: 'ImageUpload',
      initialValue: [],
    },
    {
      label: '装备',
      title: '装备', // 弹窗标题
      name: 'equipment',
      type: 'ListSelect',
      initialValue: [2, 3, 5, 7, 11, 13, 17, 19].map(i => ({ value: i, label: '装备' + i })),
      fetch: fetchEquipments,
    },
    {
      label: '其他属性',
      title: '其他属性', // 弹窗标题
      name: 'others',
      type: 'Object',
      initialValue: { a: 1, b: 2 },
    },
    {
      label: '素数',
      name: 'primes',
      type: 'Transfer',
      initialValue: [2, 3, 5, 7, 11, 13, 17, 19].map(i => ({ value: i, label: '装备' + i })),
      fetch: fetchEquipments,
      showSearch: true,
    },
    {
      label: '计划',
      name: 'cron',
      type: 'Cron',
      initialValue: '* * * 1 * ?',
    },
    */
    {
      label: '自定义内容',
      name: 'custom',
      type: 'Custom',
      children: (
        <Text type="secondary">
          ( 这是自定义内容 <SmileOutlined /> )
        </Text>
      )
    },
    {
      label: '输入框列表',
      name: 'inputList',
      type: 'Input*',
    },
    {
      label: '联系人',
      name: 'contacts',
      type: 'Card*',
      items: contactForm,
      initialValue: [
        { name: '张三', phone: '13800138000' },
      ]
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