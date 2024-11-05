/* eslint-disable react-refresh/only-export-components */
import type { FC, ReactNode } from 'react'
import { Input, InputNumber, Checkbox, Switch, Slider, Button, Typography, Radio, DatePicker, TimePicker, Cascader, ColorPicker, TreeSelect } from 'antd'
import ImageUpload from './ImageUpload'
import SelectInput from './SelectInput'
import ObjectInput from './ObjectInput'
import ListSelect from './ListSelect'
import TransferInput from './TransferInput'
import CronInput from './CronInput'

const { Link } = Typography

type FormItems = Record<string, { component: FC, valuePropName?: string }>

const formItems: FormItems = {
  // antd 组件
  Button: { component: Button },
  Cascader: { component: Cascader },
  Checkbox: { component: Checkbox.Group },
  ColorPicker: { component: ColorPicker },
  DatePicker: { component: (props) => <DatePicker {...props} /> },
  DateRangePicker: { component: (props) => <DatePicker.RangePicker {...props} /> },
  Input: { component: Input },
  InputNumber: { component: InputNumber },
  Link: { component: Link },
  Password: { component: Input.Password },
  TextArea: { component: Input.TextArea },
  Radio: { component: Radio.Group },
  Slider: { component: Slider },
  Switch: { component: Switch, valuePropName: 'checked' },
  TimePicker: { component: TimePicker },
  TimeRangePicker: { component: TimePicker.RangePicker },
  TreeSelect: { component: TreeSelect },
  // Upload: TODO

  // 自制组件
  Select: { component: SelectInput },
  Transfer: { component: TransferInput },
  ImageUpload: { component: ImageUpload },
  Object: { component: ObjectInput },
  ListSelect: { component: ListSelect },
  Cron: { component: CronInput },
  Custom: { component: (props) => (props as { children: ReactNode }).children },
  Card: { component: () => null },
}

export default formItems
