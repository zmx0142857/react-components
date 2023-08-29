import type { FC } from 'react'
import { Input, Select, InputNumber, Checkbox, Switch, Slider, Button, Typography, Radio, DatePicker } from 'antd'

const { Link } = Typography

type ColorProps = {
  onChange?: (s: string) => void
}

const Color: FC<ColorProps> = (props) => {
  return (
    <Input
      className="ant-color"
      type="color"
      {...props}
      onChange={e => props.onChange?.(e.target.value)}
    />
  )
}

type FormItems = Record<string, { component: FC, valuePropName?: string }>

const formItems: FormItems = {
  Input: { component: Input },
  Select: { component: Select },
  InputNumber: { component: InputNumber },
  Switch: { component: Switch, valuePropName: 'checked' },
  Checkbox: { component: Checkbox, valuePropName: 'checked' },
  Radio: { component: Radio.Group, valuePropName: 'checked' },
  Slider: { component: Slider },
  Color: { component: Color },
  Button: { component: Button },
  Link: { component: Link },
  DatePicker: { component: DatePicker },
}

export default formItems
